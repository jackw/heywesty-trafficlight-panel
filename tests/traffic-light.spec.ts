import { test, expect } from '@grafana/plugin-e2e';

test.describe.configure({ mode: 'parallel' });

test('Panel displays a traffic light when thresholds are correctly set', async ({ panelEditPage, page, selectors }) => {
  // @ts-expect-error - types currently set to union of core panel plugins
  await panelEditPage.setVisualization('Traffic Light');
  await page.getByRole('button', { name: /add Threshold/i }).click();
  await panelEditPage.getQueryEditorRow('A').getByText('Scenario').click();
  await page.keyboard.insertText('CSV Content');
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => (window as any).monaco);
  await panelEditPage.getByTestIdOrAriaLabel(selectors.components.CodeEditor.container).click();
  await page.keyboard.insertText(`time, value
10000000000, 100`);
  await panelEditPage.getByTestIdOrAriaLabel('Refresh dashboard').click();
  const trafficLightPanel = await page.getByTestId('heywesty-traffic-light');
  await expect(trafficLightPanel).toBeVisible();
  await expect(trafficLightPanel.getByTestId('traffic-light-go')).toBeVisible();

  await panelEditPage.getByTestIdOrAriaLabel(selectors.components.CodeEditor.container).click();
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  await page.keyboard.insertText(`time, value
10000000000, 85`);
  await panelEditPage.getByTestIdOrAriaLabel('Refresh dashboard').click();
  await expect(trafficLightPanel.getByTestId('traffic-light-ready')).toBeVisible();

  await panelEditPage.getByTestIdOrAriaLabel(selectors.components.CodeEditor.container).click();
  await page.keyboard.press('Control+A');
  await page.keyboard.press('Backspace');
  await page.keyboard.insertText(`time, value
10000000000, 50`);
  await panelEditPage.getByTestIdOrAriaLabel('Refresh dashboard').click();
  await expect(trafficLightPanel.getByTestId('traffic-light-stop')).toBeVisible();
});
