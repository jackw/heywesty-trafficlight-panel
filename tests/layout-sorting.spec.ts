import { expect, test } from '@grafana/plugin-e2e';
import { gte } from 'semver';

import { TEST_IDS } from '../src/constants';

test.describe.configure({ mode: 'parallel' });

test.describe('Layout and Sorting', () => {
  test.beforeEach(async ({ panelEditPage, page, selectors }) => {
    await panelEditPage.setVisualization('Traffic Light');
    await page.getByRole('button', { name: /add Threshold/i }).click();
    await panelEditPage.getQueryEditorRow('A').getByText('Scenario').click();
    await page.keyboard.insertText('CSV Content');
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => (window as any).monaco);
    await panelEditPage.getByGrafanaSelector(selectors.components.CodeEditor.container).click();
    await page.keyboard.insertText(`"Name","Value"\n"Item A",100\n"Item B",10\n"Item C",50`);
    await panelEditPage.refreshPanel();
  });

  test('Row layout renders lights in horizontal flex container', async ({ panelEditPage, page, selectors }) => {
    const layoutLabel = panelEditPage.getByGrafanaSelector(
      selectors.components.PanelEditor.OptionsPane.fieldLabel('Traffic Light Layout')
    );
    await layoutLabel.locator('label').filter({ hasText: /^Row/ }).click({ force: true });

    const trafficLightPanel = page.getByTestId(TEST_IDS.trafficLight);
    await expect(trafficLightPanel).toBeVisible();

    const innerContainer = trafficLightPanel.locator('> div').first();
    await expect(innerContainer).toHaveCSS('display', 'flex');
    await expect(innerContainer).toHaveCSS('overflow-x', 'auto');
  });

  test('Sort ascending orders lights lowest to highest', async ({ panelEditPage, page, selectors }) => {
    const sortLabel = panelEditPage.getByGrafanaSelector(
      selectors.components.PanelEditor.OptionsPane.fieldLabel('Traffic Light Sort lights')
    );
    await sortLabel.locator('label').filter({ hasText: /^Ascending/ }).click({ force: true });

    await expect(page.getByTestId(TEST_IDS.trafficLightLegend)).toHaveText(['Item B', 'Item C', 'Item A']);
  });

  test('Sort descending orders lights highest to lowest', async ({ panelEditPage, page, selectors }) => {
    const sortLabel = panelEditPage.getByGrafanaSelector(
      selectors.components.PanelEditor.OptionsPane.fieldLabel('Traffic Light Sort lights')
    );
    await sortLabel.locator('label').filter({ hasText: /^Descending/ }).click({ force: true });

    await expect(page.getByTestId(TEST_IDS.trafficLightLegend)).toHaveText(['Item A', 'Item C', 'Item B']);
  });

  test('Reverse colors swaps light states', async ({ panelEditPage, page, selectors, grafanaVersion }) => {
    // Use a single time-series value (100 = go by default)
    await panelEditPage.getByGrafanaSelector(selectors.components.CodeEditor.container).click();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    await page.keyboard.insertText(`time, value
10000000000, 100`);
    await panelEditPage.refreshPanel();

    const trafficLightPanel = page.getByTestId(TEST_IDS.trafficLight);
    await expect(trafficLightPanel.getByTestId(TEST_IDS.go)).toBeVisible();

    const reverseLabel = panelEditPage.getByGrafanaSelector(
      selectors.components.PanelEditor.OptionsPane.fieldLabel('Traffic Light Reverse light colors')
    );
    const reverseSwitch = gte(grafanaVersion, '11.5.0')
      ? reverseLabel.getByRole('switch')
      : reverseLabel.getByLabel('Toggle switch');
    await reverseSwitch.click({ force: true });

    await expect(trafficLightPanel.getByTestId(TEST_IDS.stop)).toBeVisible();
  });
});
