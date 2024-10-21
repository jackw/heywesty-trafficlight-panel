// @ts-check
const fs = require('fs');

const prMessageSymbol = `<!-- plugin-tools-compare-stats-comment -->`;

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatBytes(bytes) {
  if (bytes === 0) {
    return '0 Bytes';
  }
  const absBytes = Math.abs(bytes);
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(absBytes) / Math.log(k));
  return parseFloat((absBytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function generateAssetSizes(statAssets = []) {
  return new Map(
    statAssets.map((asset) => {
      return [
        asset.name,
        {
          size: asset.size,
        },
      ];
    })
  );
}

function generateModuleSizes(statChunks = []) {
  return new Map(
    statChunks.flatMap((chunk) => {
      if (!chunk.modules) {
        return [];
      }
      return chunk.modules.flatMap((module) => {
        if (module.modules) {
          return module.modules.map((submodule) => [
            submodule.name ?? '',
            {
              size: submodule.size ?? 0,
            },
          ]);
        } else {
          if (module.name.startsWith('webpack/') || module.name.startsWith('external ')) {
            return [];
          }

          return [
            [
              module.name ?? '',
              {
                size: module.size ?? 0,
              },
            ],
          ];
        }
      });
    })
  );
}

function getAssetDiff(name, oldSize, newSize) {
  return {
    name,
    new: {
      size: newSize.size,
    },
    old: {
      size: oldSize.size,
    },
    diff: newSize.size - oldSize.size,
    diffPercentage: +((1 - newSize.size / oldSize.size) * -100).toFixed(2) || 0,
  };
}

function sortDiffDescending(items) {
  return items.sort((diff1, diff2) => Math.abs(diff2.diff) - Math.abs(diff1.diff));
}

function statsDiff(oldAssets, newAssets) {
  let oldTotal = 0;
  let newTotal = 0;
  const added = [];
  const removed = [];
  const bigger = [];
  const smaller = [];
  const unchanged = [];

  for (const [name, oldAssetSizes] of oldAssets) {
    oldTotal += oldAssetSizes.size;
    const newAsset = newAssets.get(name);
    if (!newAsset) {
      removed.push(getAssetDiff(name, oldAssetSizes, { size: 0, gzipSize: 0 }));
    } else {
      const diff = getAssetDiff(name, oldAssetSizes, newAsset);

      if (diff.diffPercentage > 0) {
        bigger.push(diff);
      } else if (diff.diffPercentage < 0) {
        smaller.push(diff);
      } else {
        unchanged.push(diff);
      }
    }
  }

  for (const [name, newAssetSizes] of newAssets) {
    newTotal += newAssetSizes.size;
    const oldAsset = oldAssets.get(name);
    if (!oldAsset) {
      added.push(getAssetDiff(name, { size: 0, gzipSize: 0 }, newAssetSizes));
    }
  }

  const oldFilesCount = oldAssets.size;
  const newFilesCount = newAssets.size;

  return {
    added: sortDiffDescending(added),
    removed: sortDiffDescending(removed),
    bigger: sortDiffDescending(bigger),
    smaller: sortDiffDescending(smaller),
    unchanged,
    total: getAssetDiff(
      oldFilesCount === newFilesCount ? `${newFilesCount}` : `${oldFilesCount} → ${newFilesCount}`,
      { size: oldTotal },
      { size: newTotal }
    ),
  };
}

function getPercentageString(number) {
  if ([Infinity, -Infinity].includes(number)) {
    return '-';
  }

  const absValue = Math.abs(number);
  const value = absValue.toFixed(2);
  const sign = number < 0 ? '-' : '+';

  return `${number === 0 ? '' : sign}${value}%`;
}

function createDiffCell(assetDiff) {
  const formattedNewSize = formatBytes(assetDiff.new.size);
  const value = assetDiff.diff;
  if (value === 0) {
    return formattedNewSize;
  }
  const sign = value < 0 ? '-' : '+';

  return `${formattedNewSize} (${value === 0 ? '' : sign}${formatBytes(value)})`;
}

function printAssetTableRow(assetDiff) {
  return `| ${assetDiff.name} | ${createDiffCell(assetDiff)} | ${getPercentageString(assetDiff.diffPercentage)} |`;
}

function printAssetTables(assetsDiff) {
  const result = ['added', 'removed', 'bigger', 'smaller', 'unchanged']
    .map((assetDiffField) => {
      const assets = assetsDiff[assetDiffField];
      const title = capitalize(assetDiffField);
      if (assets.length === 0) {
        return `**${title}**\n\nNo assets were ${assetDiffField}\n`;
      }

      return `**${title}**\n\n
| Name | Size | % Diff |
| --- | --- | --- |
${assets.map((assetDiff) => printAssetTableRow(assetDiff)).join('\n')}
`;
    })
    .join('\n\n');

  return result;
}

function printChunkModulesTable(modulesDiff) {
  const result = ['added', 'removed', 'bigger', 'smaller', 'unchanged'];
  return result
    .map((moduleDiffField) => {
      const modules = modulesDiff[moduleDiffField];
      const title = capitalize(moduleDiffField);
      if (modules.length === 0) {
        return `**${title}**\n\nNo modules were ${moduleDiffField}\n`;
      }

      return `**${title}**\n\n
| Name | Size | % Diff |
| --- | --- | --- |
${modules.map((moduleDiff) => printAssetTableRow(moduleDiff)).join('\n')}
`;
    })
    .join('\n\n');
}

function getComment(assetsDiff, modulesDiff) {
  return `${prMessageSymbol}
### Bundle Size Changes

Hello! 👋 This comment was generated by a Github Action to help you and reviewers understand the impact of your PR on frontend bundle sizes.

Whenever this PR is updated, this comment will update to reflect the latest changes.

| Files | Total bundle size | % diff |
| --- | --- | --- |
${printAssetTableRow(assetsDiff.total)}
<details>
<summary>View detailed bundle information</summary>
<div>

${printAssetTables(assetsDiff)}

</div>
</details>

${
  modulesDiff
    ? `<details>
<summary>View module information</summary>
<div>

${printChunkModulesTable(modulesDiff)}

</div>
</details>`
    : ''
}
`;
}

function compareStats(mainStatsFile, prStatsFile) {
  try {
    if (!fs.existsSync(mainStatsFile)) {
      throw new Error(`Main stats file not found: ${mainStatsFile}`);
    }
    if (!fs.existsSync(prStatsFile)) {
      throw new Error(`PR stats file not found: ${prStatsFile}`);
    }

    const mainStats = JSON.parse(fs.readFileSync(mainStatsFile).toString());
    const prStats = JSON.parse(fs.readFileSync(prStatsFile).toString());

    if (!mainStats.assets || !prStats.assets) {
      throw new Error('Invalid stats file format: Missing assets property.');
    }

    const mainAssets = generateAssetSizes(mainStats.assets);
    const prAssets = generateAssetSizes(prStats.assets);
    const mainModules = generateModuleSizes(mainStats.chunks);
    const prModules = generateModuleSizes(prStats.chunks);
    const assetsDiff = statsDiff(mainAssets, prAssets);
    const modulesDiff = statsDiff(mainModules, prModules);

    return getComment(assetsDiff, modulesDiff);
  } catch (error) {
    throw new Error(`Error comparing stats: ${error.message}`);
  }
}

module.exports = async ({ core, context, github }, mainStatsFile, prStatsFile) => {
  try {
    const {
      payload: { pull_request },
      repo,
    } = context;
    const prNumber = pull_request.number;
    const commentBody = compareStats(mainStatsFile, prStatsFile);

    const { data: comments } = await github.rest.issues.listComments({
      ...repo,
      issue_number: prNumber,
    });

    let previousCommentId;
    for (const { body, id } of comments) {
      if (body?.includes(prMessageSymbol)) {
        previousCommentId = id;
      }
    }

    if (previousCommentId) {
      await github.rest.issues.updateComment({
        ...repo,
        comment_id: previousCommentId,
        body: commentBody,
      });
    } else {
      await github.rest.issues.createComment({
        ...repo,
        issue_number: prNumber,
        body: commentBody,
      });
    }

    core.setOutput('report', commentBody);
  } catch (error) {
    core.setFailed(error.message);
  }
};
