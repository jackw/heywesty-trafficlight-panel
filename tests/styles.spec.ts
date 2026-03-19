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

  test('Rounded style renders traffic light', async ({ panelEditPage, page }) => {
    const trafficLightOptions = panelEditPage.getCustomOptions('Traffic Light');
    await trafficLightOptions.getSelect('Traffic light style').selectOption('Rounded');
    await panelEditPage.refreshPanel();

    const trafficLightPanel = page.getByTestId(TEST_IDS.trafficLight);
    await expect(trafficLightPanel).toBeVisible();
    await expect(trafficLightPanel.getByTestId(TEST_IDS.go)).toBeVisible();
  });

  test('Sidelights style renders traffic light', async ({ panelEditPage, page }) => {
    const trafficLightOptions = panelEditPage.getCustomOptions('Traffic Light');
    await trafficLightOptions.getSelect('Traffic light style').selectOption('Sidelights');
    await panelEditPage.refreshPanel();

    const trafficLightPanel = page.getByTestId(TEST_IDS.trafficLight);
    await expect(trafficLightPanel).toBeVisible();
    await expect(trafficLightPanel.getByTestId(TEST_IDS.go)).toBeVisible();
  });

  test('Dynamic style renders traffic light', async ({ panelEditPage, page }) => {
    const trafficLightOptions = panelEditPage.getCustomOptions('Traffic Light');
    await trafficLightOptions.getSelect('Traffic light style').selectOption('Dynamic');
    await panelEditPage.refreshPanel();

    const trafficLightPanel = page.getByTestId(TEST_IDS.trafficLight);
    await expect(trafficLightPanel).toBeVisible();
    await expect(trafficLightPanel.locator('svg')).toBeVisible();
  });

  test('Horizontal orientation changes SVG aspect ratio', async ({ panelEditPage, page, selectors, grafanaVersion }) => {
    const horizontalSwitchLabel = panelEditPage.getByGrafanaSelector(
      selectors.components.PanelEditor.OptionsPane.fieldLabel('Traffic Light Horizontal traffic lights')
    );
    const horizontalSwitch = gte(grafanaVersion, '11.5.0')
      ? horizontalSwitchLabel.getByRole('switch')
      : horizontalSwitchLabel.getByLabel('Toggle switch');

    await horizontalSwitch.click({ force: true });

    const trafficLightPanel = page.getByTestId(TEST_IDS.trafficLight);
    const svg = trafficLightPanel.locator('svg').first();
    await expect(svg).toHaveAttribute('viewBox', '0 0 512 272');

    await horizontalSwitch.click({ force: true });

    await expect(svg).toHaveAttribute('viewBox', '0 0 272 512');
  });
});
