import { test } from '@grafana/plugin-e2e';

test.describe.configure({ mode: 'parallel' });

test('add a traffic light panel to a new dashboard', async ({ panelEditPage, page }) => {
  // @ts-expect-error - types currently set to union of core panel plugins
  await panelEditPage.setVisualization('Traffic Light');
  await panelEditPage.setPanelTitle('Traffic light panel test');
  await panelEditPage.collapseSection('Traffic Light');

});

// test('open a clock panel in a provisioned dashboard and set time format to "12 hour"', async ({
//   selectors,
//   page,
//   request,
//   grafanaVersion,
//   readProvision,
// }) => {
//   const dashboard = await readProvision({ filePath: 'provisioning/dashboards/panels.json' });
//   const args = { dashboard: { uid: dashboard.uid }, id: '5' };
//   const panelEditPage = await new PanelEditPage({ page, selectors, grafanaVersion, request }, args);
//   await panelEditPage.goto();
//   await expect(panelEditPage.getVisualizationName()).toHaveText('Clock');
//   await panelEditPage.collapseSection('Clock');
//   await clickRadioButton(page, '12 Hour');
//   await expect(true).toBe(true);
// });
