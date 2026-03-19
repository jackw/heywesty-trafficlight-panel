import { expect, test } from '@grafana/plugin-e2e';

import { TEST_IDS } from '../src/constants';

test.describe.configure({ mode: 'parallel' });

test('noValue field config shows light when query returns no data', async ({ panelEditPage, page, selectors }) => {
  await panelEditPage.setVisualization('Traffic Light');
  await page.getByRole('button', { name: /add Threshold/i }).click();

  // Set a numeric noValue so processNoData can map it to a threshold color
  const noValueLabel = panelEditPage.getByGrafanaSelector(
    selectors.components.PanelEditor.OptionsPane.fieldLabel('Standard options No value')
  );
  await noValueLabel.getByRole('textbox').fill('50');
  await page.keyboard.press('Tab');

  // CSV Content with no data rows → query returns no data
  await panelEditPage.getQueryEditorRow('A').getByText('Scenario').click();
  await page.keyboard.insertText('CSV Content');
  await page.keyboard.press('Enter');

  await panelEditPage.refreshPanel();

  const trafficLightPanel = page.getByTestId(TEST_IDS.trafficLight);
  await expect(trafficLightPanel).toBeVisible();
  await expect(page.getByTestId(TEST_IDS.trafficLightValue)).toHaveText('50');
});
