import { test, expect } from '@grafana/plugin-e2e';
import { TEST_IDS } from '../src/constants';

test.describe.configure({ mode: 'parallel' });

test('Panel displays a traffic light when thresholds are correctly set', async ({ panelEditPage, page, selectors }) => {
  await panelEditPage.setVisualization('Traffic Light');
  await page.getByRole('button', { name: /add Threshold/i }).click();
  await panelEditPage.getQueryEditorRow('A').getByText('Scenario').click();
  await page.keyboard.insertText('CSV Content');
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => (window as any).monaco);
  await panelEditPage.getByGrafanaSelector(selectors.components.CodeEditor.container).click();
  await page.keyboard.insertText(`time, value
10000000000, 100`);
  panelEditPage.refreshPanel();
  const trafficLightPanel = await page.getByTestId(TEST_IDS.trafficLight);
  await expect(trafficLightPanel).toBeVisible();
  await expect(trafficLightPanel.getByTestId(TEST_IDS.go)).toBeVisible();

  await panelEditPage.getByGrafanaSelector(selectors.components.CodeEditor.container).click();
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  await page.keyboard.insertText(`time, value
10000000000, 85`);
  panelEditPage.refreshPanel();
  await expect(trafficLightPanel.getByTestId(TEST_IDS.ready)).toBeVisible();

  await panelEditPage.getByGrafanaSelector(selectors.components.CodeEditor.container).click();
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  await page.keyboard.insertText(`time, value
10000000000, 50`);
  panelEditPage.refreshPanel();
  await expect(trafficLightPanel.getByTestId(TEST_IDS.stop)).toBeVisible();
});

test('Panel options toggle values component correctly', async ({ panelEditPage, page, selectors }) => {
  await panelEditPage.setVisualization('Traffic Light');
  await page.getByRole('button', { name: /add Threshold/i }).click();
  const trafficLightPanelValue = await page.getByTestId(TEST_IDS.trafficLightValue);
  await expect(trafficLightPanelValue).toBeVisible();
});
