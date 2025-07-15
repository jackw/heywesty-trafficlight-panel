import type { Configuration } from '@rspack/core';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { merge } from 'webpack-merge';

import grafanaConfig from './.config/webpack/webpack.config';

const config = async (env: Record<string, unknown>): Promise<Configuration> => {
  const baseConfig = await grafanaConfig(env);

  return merge(baseConfig, {
    // Adds a webpack plugin to the configuration
    plugins: [new BundleAnalyzerPlugin()],
  });
};

export default config;
