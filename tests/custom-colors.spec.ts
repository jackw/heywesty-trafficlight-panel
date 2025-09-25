import { expect, test } from '@grafana/plugin-e2e';

import { TEST_IDS } from '../src/constants';

test.describe.configure({ mode: 'parallel' });

test.describe('Custom Colors Feature', () => {
  test.beforeEach(async ({ panelEditPage, page }) => {
    // Set up basic traffic light panel with thresholds
    await panelEditPage.setVisualization('Traffic Light');
    await page.getByRole('button', { name: /add Threshold/i }).click();
    await panelEditPage.getQueryEditorRow('A').getByText('Scenario').click();
    await page.keyboard.insertText('CSV Content');
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => (window as any).monaco);
    await panelEditPage.getByGrafanaSelector(panelEditPage.ctx.selectors.components.CodeEditor.container).click();
    await page.keyboard.insertText(`time, value
10000000000, 100`);
    await panelEditPage.refreshPanel();
  });

  test('Custom background colors are applied to traffic light SVG', async ({ panelEditPage, page }) => {
    // Get panel options and enable custom colors
    const trafficLightOptions = panelEditPage.getCustomOptions('Traffic Light');
    const customColorsSwitch = trafficLightOptions.getSwitch('Custom colors');
    await customColorsSwitch.check();

    // Set a distinctive custom color for dark theme background
    const backgroundColorPicker = trafficLightOptions.getColorPicker('Dark theme background');

    await backgroundColorPicker.selectOption('#73bf69');
    await expect(backgroundColorPicker.locator().getByText('#73bf69')).toBeVisible();

    const trafficLightPanel = page.getByTestId(TEST_IDS.trafficLight);
    await expect(trafficLightPanel).toBeVisible();
    const svgPath = trafficLightPanel.locator('svg path').nth(1);
    await expect(svgPath).toBeVisible();

    // Verify the fill attribute matches our custom color
    const fillColor = await svgPath.getAttribute('fill');
    expect(fillColor).toBe('#73bf69');
  });

  test('Custom empty light colors are applied to non-active lights', async ({ panelEditPage, page }) => {
    // Get panel options and enable custom colors
    const trafficLightOptions = panelEditPage.getCustomOptions('Traffic Light');
    const customColorsSwitch = trafficLightOptions.getSwitch('Custom colors');
    await customColorsSwitch.check();

    const darkEmptyColorPicker = trafficLightOptions.getColorPicker('Dark theme empty lights');
    await darkEmptyColorPicker.selectOption('#ff0000');
    await expect(darkEmptyColorPicker.locator().getByText('#ff0000')).toBeVisible();

    const trafficLightPanel = page.getByTestId(TEST_IDS.trafficLight);
    await expect(trafficLightPanel).toBeVisible();
    const svgPath = trafficLightPanel.locator('svg path').first();
    await expect(svgPath).toBeVisible();

    // Verify the fill attribute matches our custom color
    const fillColor = await svgPath.getAttribute('fill');
    expect(fillColor).toBe('#ff0000');
  });
});
