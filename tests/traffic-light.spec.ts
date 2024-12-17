import { test, expect } from '@grafana/plugin-e2e';
import { TEST_IDS } from '../src/constants';
import { Locator } from '@playwright/test';
import { gte } from 'semver';

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

test('Panel options toggle values component correctly', async ({ panelEditPage, page, selectors, grafanaVersion }) => {
  await panelEditPage.setVisualization('Traffic Light');
  await page.getByRole('button', { name: /add Threshold/i }).click();

  const trafficLightPanelValue = await page.getByTestId(TEST_IDS.trafficLightValue);
  const trafficLightPanelLegend = await page.getByTestId(TEST_IDS.trafficLightLegend);
  const trafficLightValueContainer = await page.getByTestId(TEST_IDS.trafficLightValueContainer);
  await expect(trafficLightValueContainer).toBeVisible();
  await expect(trafficLightPanelValue).toBeVisible();
  await expect(trafficLightPanelLegend).toBeVisible();

  const trendColor = await getBackgroundColor(trafficLightValueContainer);
  await expect(trendColor).not.toBe('rgba(0, 0, 0, 0)');

  const trendSwitchLabel = panelEditPage.getByGrafanaSelector(
    selectors.components.PanelEditor.OptionsPane.fieldLabel('Traffic Light Show trend')
  );
  const showTrendSwitch = gte(grafanaVersion, '11.5.0')
    ? trendSwitchLabel.getByRole('switch')
    : trendSwitchLabel.getByLabel('Toggle switch');

  await showTrendSwitch.click({ force: true });

  const noTrendColor = await getBackgroundColor(trafficLightValueContainer);
  await expect(noTrendColor).toBe('rgba(0, 0, 0, 0)');

  const valueSwitchLabel = panelEditPage.getByGrafanaSelector(
    selectors.components.PanelEditor.OptionsPane.fieldLabel('Traffic Light Show value')
  );
  const showValueSwitch = gte(grafanaVersion, '11.5.0')
    ? valueSwitchLabel.getByRole('switch')
    : valueSwitchLabel.getByLabel('Toggle switch');

  await showValueSwitch.click({ force: true });
  await expect(trafficLightPanelValue).not.toBeVisible();

  const legendSwitchLabel = panelEditPage.getByGrafanaSelector(
    selectors.components.PanelEditor.OptionsPane.fieldLabel('Traffic Light Show legend')
  );

  const showLegendSwitch = gte(grafanaVersion, '11.5.0')
    ? legendSwitchLabel.getByRole('switch')
    : legendSwitchLabel.getByLabel('Toggle switch');

  await showLegendSwitch.click({ force: true });

  await expect(trafficLightPanelLegend).not.toBeVisible();
  await expect(trafficLightValueContainer).not.toBeVisible();
});

test('Table data: panel displays a traffic light for each row', async ({ panelEditPage, page, selectors }) => {
  await panelEditPage.setVisualization('Traffic Light');
  await page.getByRole('button', { name: /add Threshold/i }).click();
  await panelEditPage.getQueryEditorRow('A').getByText('Scenario').click();
  await page.keyboard.insertText('CSV Content');
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => (window as any).monaco);
  await panelEditPage.getByGrafanaSelector(selectors.components.CodeEditor.container).click();
  await page.keyboard.insertText(`"Name","Value"
"Blob Storage", 100
"Exported Storage", 40
"Hangfire", 30
"Imported Storage", 50
"SQL server db", 10`);
  panelEditPage.refreshPanel();
  const trafficLightPanel = await page.getByTestId(TEST_IDS.trafficLight);
  await expect(trafficLightPanel).toBeVisible();
  await expect(trafficLightPanel.getByTestId(TEST_IDS.go)).toBeVisible();
  const trafficLightPanelValues = await page.getByTestId(TEST_IDS.trafficLightValue).all();
  await expect(trafficLightPanelValues.length).toBe(5);
});

async function getBackgroundColor(el: Locator) {
  return el.evaluate((el) => {
    return window.getComputedStyle(el).getPropertyValue('background-color');
  });
}
