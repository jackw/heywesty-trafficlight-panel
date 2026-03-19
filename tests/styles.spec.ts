import { expect, test } from '@grafana/plugin-e2e';
import { gte } from 'semver';

import { TEST_IDS } from '../src/constants';

test.describe.configure({ mode: 'parallel' });

test.describe('Traffic Light Styles', () => {
  test.beforeEach(async ({ panelEditPage, page, selectors }) => {
    await panelEditPage.setVisualization('Traffic Light');
    await page.getByRole('button', { name: /add Threshold/i }).click();
    await panelEditPage.getQueryEditorRow('A').getByText('Scenario').click();
    await page.keyboard.insertText('CSV Content');
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => (window as any).monaco);
    await panelEditPage.getByGrafanaSelector(selectors.components.CodeEditor.container).click();
    await page.keyboard.insertText(`time, value
10000000000, 100`);
    await panelEditPage.refreshPanel();
  });

  test('Default style renders the correct SVG', async ({ page }) => {
    const trafficLightPanel = page.getByTestId(TEST_IDS.trafficLight);
    await expect(trafficLightPanel.getByTestId(TEST_IDS.styleDefault)).toBeVisible();
  });

  test('Rounded style renders the correct SVG', async ({ panelEditPage, page }) => {
    await panelEditPage.getCustomOptions('Traffic Light').getSelect('Traffic light style').selectOption('Rounded');
    await panelEditPage.refreshPanel();

    const trafficLightPanel = page.getByTestId(TEST_IDS.trafficLight);
    await expect(trafficLightPanel.getByTestId(TEST_IDS.styleRounded)).toBeVisible();
  });

  test('Sidelights style renders the correct SVG', async ({ panelEditPage, page }) => {
    await panelEditPage.getCustomOptions('Traffic Light').getSelect('Traffic light style').selectOption('Sidelights');
    await panelEditPage.refreshPanel();

    const trafficLightPanel = page.getByTestId(TEST_IDS.trafficLight);
    await expect(trafficLightPanel.getByTestId(TEST_IDS.styleSidelights)).toBeVisible();
  });

  test('Dynamic style renders the correct SVG', async ({ panelEditPage, page }) => {
    await panelEditPage.getCustomOptions('Traffic Light').getSelect('Traffic light style').selectOption('Dynamic');
    await panelEditPage.refreshPanel();

    const trafficLightPanel = page.getByTestId(TEST_IDS.trafficLight);
    await expect(trafficLightPanel.getByTestId(TEST_IDS.styleDynamic)).toBeVisible();
  });

  test('Horizontal orientation changes SVG aspect ratio', async ({ panelEditPage, page, selectors, grafanaVersion }) => {
    const horizontalSwitchLabel = panelEditPage.getByGrafanaSelector(
      selectors.components.PanelEditor.OptionsPane.fieldLabel('Traffic Light Horizontal traffic lights')
    );
    const horizontalSwitch = gte(grafanaVersion, '11.5.0')
      ? horizontalSwitchLabel.getByRole('switch')
      : horizontalSwitchLabel.getByLabel('Toggle switch');

    await horizontalSwitch.click({ force: true });

    const svg = page.getByTestId(TEST_IDS.trafficLight).getByTestId(TEST_IDS.styleDefault);
    await expect(svg).toHaveAttribute('viewBox', '0 0 512 272');

    await horizontalSwitch.click({ force: true });

    await expect(svg).toHaveAttribute('viewBox', '0 0 272 512');
  });
});
