'use client';

import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { useTheme } from '@/shared/hooks/useTheme';
import { cn } from '@/shared/lib/utils/cn';

/**
 * Reads a CSS custom property value from the document root.
 */
function getCSSVar(name: string): string {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/**
 * Builds an ECharts color palette from the FALP design system CSS variables.
 */
function buildThemeColors() {
  return {
    color: [
      getCSSVar('--color-primary'),
      getCSSVar('--color-secondary'),
      getCSSVar('--color-success'),
      getCSSVar('--color-warning'),
      getCSSVar('--color-error'),
      getCSSVar('--color-info'),
    ],
    fg: getCSSVar('--color-fg'),
    fgMuted: getCSSVar('--color-fg-muted'),
    fgSubtle: getCSSVar('--color-fg-subtle'),
    bg: getCSSVar('--color-bg'),
    border: getCSSVar('--color-border'),
  };
}

export interface EChartProps {
  /** ECharts option configuration */
  option: EChartsOption;
  /** Chart height */
  height?: string | number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Wrapper around Apache ECharts that integrates with the FALP design system.
 * Automatically adapts to light/dark theme changes.
 *
 * @example
 * ```tsx
 * <EChart
 *   height={300}
 *   option={{
 *     xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed'] },
 *     yAxis: { type: 'value' },
 *     series: [{ type: 'bar', data: [120, 200, 150] }],
 *   }}
 * />
 * ```
 */
export function EChart({ option, height = 350, className }: EChartProps) {
  const { resolvedTheme } = useTheme();

  const mergedOption = useMemo<EChartsOption>(() => {
    const t = buildThemeColors();

    return {
      color: t.color,
      backgroundColor: 'transparent',
      textStyle: {
        color: t.fgMuted,
        fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
      },
      title: {
        textStyle: { color: t.fg, fontWeight: 600, fontSize: 14 },
        subtextStyle: { color: t.fgMuted },
      },
      legend: {
        textStyle: { color: t.fgMuted },
      },
      tooltip: {
        backgroundColor: t.bg,
        borderColor: t.border,
        textStyle: { color: t.fg },
      },
      xAxis: {
        axisLine: { lineStyle: { color: t.border } },
        axisTick: { lineStyle: { color: t.border } },
        axisLabel: { color: t.fgMuted },
        splitLine: { lineStyle: { color: t.border, type: 'dashed' } },
      },
      yAxis: {
        axisLine: { lineStyle: { color: t.border } },
        axisTick: { lineStyle: { color: t.border } },
        axisLabel: { color: t.fgMuted },
        splitLine: { lineStyle: { color: t.border, type: 'dashed' } },
      },
      grid: {
        containLabel: true,
        left: 12,
        right: 12,
        top: 40,
        bottom: 12,
      },
      ...option,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [option, resolvedTheme]);

  return (
    <div className={cn('w-full', className)}>
      <ReactECharts
        option={mergedOption}
        style={{ height, width: '100%' }}
        notMerge
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
}
