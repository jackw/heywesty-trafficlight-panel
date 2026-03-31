import { expect, test } from '@grafana/plugin-e2e';
import { gte } from 'semver';

import { TEST_IDS } from '../src/constants';

test.describe.configure({ mode: 'parallel' });

test.describe('Traffic Light Stack Light', () => {
  test.beforeEach(async ({ panelEditPage, page, selectors }) => {
    await panelEditPage.setVisualization('Traffic Light');
    await page.getByRole('button', { name: /add Threshold/i }).click();
    await panelEditPage.getQueryEditorRow('A').getByText('Scenario').click();
    await page.keyboard.insertText('CSV Content');
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => (window as any).monaco);
    await panelEditPage.getByGrafanaSelector(selectors.components.CodeEditor.container).click();
    await page.keyboard.insertText(`time,Running\n10000000000,100`);
    await panelEditPage.getCustomOptions('Traffic Light').getSelect('Traffic light style').selectOption('Stack light');
    await panelEditPage.refreshPanel();
  });

  test('renders the stack light SVG', async ({ page }) => {
    const trafficLightPanel = page.getByTestId(TEST_IDS.trafficLight);
    await expect(trafficLightPanel.getByTestId(TEST_IDS.styleStackLight)).toBeVisible();
  });

  test('renders one segment per field', async ({ panelEditPage, page, selectors }) => {
    await panelEditPage.getByGrafanaSelector(selectors.components.CodeEditor.container).click();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    await page.keyboard.insertText(`time,Field A,Field B,Field C\n10000000000,100,100,100`);
    await panelEditPage.refreshPanel();

    const svg = page.getByTestId(TEST_IDS.trafficLight).getByTestId(TEST_IDS.styleStackLight);
    await expect(svg.locator('rect')).toHaveCount(3);
  });

  test('segment glows when value crosses trigger threshold', async ({ page }) => {
    const svg = page.getByTestId(TEST_IDS.trafficLight).getByTestId(TEST_IDS.styleStackLight);
    const segment = svg.locator('rect').first();
    await expect(segment).toHaveAttribute('style', /drop-shadow/);
  });

  test('segment is dim when value is below trigger threshold', async ({ panelEditPage, page, selectors }) => {
    await panelEditPage.getByGrafanaSelector(selectors.components.CodeEditor.container).click();
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    await page.keyboard.insertText(`time,Running\n10000000000,0`);
    await panelEditPage.refreshPanel();

    const svg = page.getByTestId(TEST_IDS.trafficLight).getByTestId(TEST_IDS.styleStackLight);
    const segment = svg.locator('rect').first();
    await expect(segment).not.toHaveAttribute('style', /drop-shadow/);
  });

  test('renders with 2-step thresholds without IncorrectThresholds error', async ({ page }) => {
    await expect(page.getByTestId(TEST_IDS.trafficLight)).toBeVisible();
    await expect(page.getByTestId(TEST_IDS.feedbackMsgContainer)).not.toBeVisible();
  });

  test('horizontal orientation changes SVG viewBox', async ({ panelEditPage, page, selectors, grafanaVersion }) => {
    const horizontalSwitchLabel = panelEditPage.getByGrafanaSelector(
      selectors.components.PanelEditor.OptionsPane.fieldLabel('Traffic Light Horizontal traffic lights')
    );
    const horizontalSwitch = gte(grafanaVersion, '11.5.0')
      ? horizontalSwitchLabel.getByRole('switch')
      : horizontalSwitchLabel.getByLabel('Toggle switch');

    await horizontalSwitch.click({ force: true });

    const svg = page.getByTestId(TEST_IDS.trafficLight).getByTestId(TEST_IDS.styleStackLight);
    await expect(svg).toHaveAttribute('viewBox', '0 0 512 272');

    await horizontalSwitch.click({ force: true });
    await expect(svg).toHaveAttribute('viewBox', '0 0 272 512');
  });
});
