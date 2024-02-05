import { css, cx } from '@emotion/css';
import { GrafanaTheme2, ThresholdsConfig } from '@grafana/data';
import { Alert, Icon, useStyles2 } from '@grafana/ui';
import React from 'react';

export function ThresholdsAssistant({ thresholds }: { thresholds?: ThresholdsConfig }) {
  const validSteps = validateThresholds(thresholds!);
  const styles = useStyles2(getStyles);
  return (
    <Alert title="Invalid thresholds" severity="warning" style={{ maxWidth: 500 }}>
      <p>Please configure thresholds for all three lights:</p>
      <div className={styles.grid}>
        <div className={styles.trafficLight} />
        {validSteps.map((step, i) => (
          <ThresholdFeedback isValid={step.isValid} index={i} />
        ))}
      </div>
    </Alert>
  );
}

const BASE_LIGHT_GRID_AREA = [2, 1, 3, 2];
const BASE_LABEL_GRID_AREA = [2, 2, 3, 3];

function ThresholdFeedback({ isValid, index }: { isValid: boolean; index: number }) {
  const iconName = isValid ? 'check' : 'times';
  const label = isValid ? 'Threshold configured' : 'Threshold not configured';
  const styles = useStyles2(getStyles);
  const lightGridArea = BASE_LIGHT_GRID_AREA.map((n, i) => (i % 2 === 0 ? n + index : n)).join(' / ');
  const labelGridArea = BASE_LABEL_GRID_AREA.map((n, i) => (i % 2 === 0 ? n + index : n)).join(' / ');
  return (
    <>
      <div style={{ gridArea: lightGridArea }} className={cx(styles.light, isValid ? styles.valid : styles.invalid)}>
        <Icon name={iconName} size="lg" />
      </div>
      <span style={{ gridArea: labelGridArea }} className={styles.label}>
        {label}
      </span>
    </>
  );
}

function validateThresholds(thresholds: ThresholdsConfig) {
  const { steps } = thresholds;
  const validNumberOfSteps = Array(3).fill(null);
  const result = validNumberOfSteps.map((_, i) => {
    return {
      isValid: Boolean(steps[i]),
    };
  });

  return result;
}

const getStyles = (theme: GrafanaTheme2) => ({
  grid: css({
    display: 'grid',
    gridTemplateColumns: '40px 1fr',
    gridTemplateRows: '4px repeat(3, 1fr) 4px',
    gap: theme.spacing(),
  }),
  trafficLight: css({
    backgroundColor: theme.colors.background.canvas,
    borderRadius: 50,
    gridArea: '1 / 1 / 6 / 2',
  }),
  light: css({
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: 100,
    display: 'flex',
    justifyContent: 'center',
    height: 26,
    placeSelf: 'center',
    width: 26,
  }),
  label: css({
    display: 'flex',
    alignItems: 'center',
    fontSize: theme.typography.size.sm,
  }),
  valid: css({
    backgroundColor: theme.colors.success.main,
  }),
  invalid: css({
    backgroundColor: theme.colors.error.main,
  }),
});
