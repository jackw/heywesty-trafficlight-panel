import { test, expect } from '@grafana/plugin-e2e';

test.describe.configure({ mode: 'parallel' });

test('Panel displays threshold assistant when thresholds incorrectly set', async ({ panelEditPage, page }) => {
  // @ts-expect-error - types currently set to union of core panel plugins
  await panelEditPage.setVisualization('Traffic Light');
  await panelEditPage.setPanelTitle('Traffic light panel test');
  await expect(panelEditPage.getVisualizationName()).toHaveText('Traffic Light');
  const thresholdsAssistant = await page.getByLabel('Invalid thresholds');
  await expect(thresholdsAssistant).toBeVisible();
  const invalidThresholds = await thresholdsAssistant.getByText('Threshold not configured');

  await expect(await invalidThresholds).toHaveCount(1);
  await page.getByRole('button', { name: /Remove Threshold 1/i }).click();

  await expect(await invalidThresholds).toHaveCount(2);
  await page.getByRole('button', { name: /add Threshold/i }).click();
  await page.getByRole('button', { name: /add Threshold/i }).click();

  await expect(thresholdsAssistant).not.toBeVisible();
  await expect(page.getByTestId('heywesty-traffic-light')).toBeVisible();
});

test('Panel displays no data message when no data is returned', async ({ panelEditPage, page }) => {
  // @ts-expect-error - types currently set to union of core panel plugins
  await panelEditPage.setVisualization('Traffic Light');
  await panelEditPage.setPanelTitle('Traffic light panel test');

  await panelEditPage.getQueryEditorRow('A').getByText('Scenario').click();
  await page.keyboard.insertText('CSV Content');
  await page.keyboard.press('Enter');

  await expect(panelEditPage.getVisualizationName()).toHaveText('Traffic Light');
  await expect(await page.getByTestId('feedback-message-container')).toHaveText('The query returned no data.');
  await expect(page.getByTestId('heywesty-traffic-light')).not.toBeVisible();
});

test('Panel displays unsupported message when data format is unsupported', async ({
  panelEditPage,
  page,
  selectors,
}) => {
  // @ts-expect-error - types currently set to union of core panel plugins
  await panelEditPage.setVisualization('Traffic Light');
  await panelEditPage.setPanelTitle('Traffic light panel test');

  await panelEditPage.getQueryEditorRow('A').getByText('Scenario').click();
  await page.keyboard.insertText('CSV Content');
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => (window as any).monaco);
  await panelEditPage.getByTestIdOrAriaLabel(selectors.components.CodeEditor.container).click();
  await page.keyboard.insertText(`time, value
10000000000, 'a'`);
  await panelEditPage.getByTestIdOrAriaLabel('Refresh dashboard').click();

  await expect(panelEditPage.getVisualizationName()).toHaveText('Traffic Light');
  await expect(await page.getByTestId('feedback-message-container')).toHaveText('This data format is unsupported.');
  await expect(page.getByTestId('heywesty-traffic-light')).not.toBeVisible();
});
