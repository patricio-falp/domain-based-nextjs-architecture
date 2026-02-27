---
name: create-chart
description: Create a new chart or data visualization using Apache ECharts. Use when the user asks to add a chart, graph, visualization, plot, dashboard widget, or display data visually (line, bar, pie, area, scatter, radar, etc.).
---

# Create Chart (Apache ECharts)

## When to Use

Use this skill when the user asks to add a chart, graph, data visualization, or dashboard widget.

## Architecture

### Key Files

- `src/components/charts/EChart.tsx` - Theme-aware ECharts wrapper (use this, never raw echarts)
- `src/app/charts/_charts-demo.tsx` - Reference implementations for all chart types

### EChart Wrapper

The `<EChart>` component handles:

- Automatic light/dark theme switching via CSS variables
- Consistent tooltip, axis, and legend styling
- SVG renderer for crisp rendering
- Default grid with `containLabel: true`

### Basic Usage

```tsx
import { EChart } from '@/components/charts/EChart';

<EChart
  height={300}
  option={{
    xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed'] },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: [120, 200, 150] }],
  }}
/>;
```

## Chart Templates

### Line Chart

```tsx
<EChart
  height={300}
  option={{
    tooltip: { trigger: 'axis' },
    legend: { data: ['Series A', 'Series B'], itemGap: 40, top: 0 },
    grid: { top: 50 },
    xAxis: { type: 'category', data: months, boundaryGap: false },
    yAxis: { type: 'value' },
    series: [
      { name: 'Series A', type: 'line', smooth: true, data: [...] },
      { name: 'Series B', type: 'line', smooth: true, data: [...] },
    ],
  }}
/>
```

### Bar Chart

```tsx
<EChart
  height={300}
  option={{
    tooltip: { trigger: 'axis' },
    legend: { data: ['2024', '2025'], itemGap: 40, top: 0 },
    grid: { top: 50 },
    xAxis: { type: 'category', data: ['Q1', 'Q2', 'Q3', 'Q4'] },
    yAxis: { type: 'value' },
    series: [
      {
        name: '2024',
        type: 'bar',
        data: [320, 332, 301, 434],
        itemStyle: { borderRadius: [4, 4, 0, 0] },
      },
      {
        name: '2025',
        type: 'bar',
        data: [420, 532, 491, 614],
        itemStyle: { borderRadius: [4, 4, 0, 0] },
      },
    ],
  }}
/>
```

### Donut / Pie Chart

```tsx
<EChart
  height={300}
  option={{
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { orient: 'vertical', right: 10, top: 'center', itemGap: 30 },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'], // Donut (use ['0%', '70%'] for solid pie)
        center: ['40%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 6, borderColor: 'transparent', borderWidth: 2 },
        label: { show: false },
        emphasis: { label: { show: true, fontWeight: 'bold' } },
        data: [
          { value: 1048, name: 'Organic' },
          { value: 735, name: 'Direct' },
          { value: 580, name: 'Referral' },
        ],
      },
    ],
  }}
/>
```

### Area Chart

```tsx
<EChart
  height={300}
  option={{
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: days, boundaryGap: false },
    yAxis: { type: 'value' },
    series: [{
      type: 'line',
      smooth: true,
      data: [...],
      areaStyle: { opacity: 0.15 },
      lineStyle: { width: 2 },
    }],
  }}
/>
```

### Scatter Plot

```tsx
<EChart
  height={300}
  option={{
    tooltip: { trigger: 'item' },
    legend: { data: ['Group A', 'Group B'], itemGap: 40, top: 0 },
    grid: { top: 50 },
    xAxis: { type: 'value', name: 'X Axis' },
    yAxis: { type: 'value', name: 'Y Axis' },
    series: [
      { name: 'Group A', type: 'scatter', data: [[x, y], ...], symbolSize: 10 },
      { name: 'Group B', type: 'scatter', data: [[x, y], ...], symbolSize: 10 },
    ],
  }}
/>
```

### Radar Chart

```tsx
<EChart
  height={300}
  option={{
    tooltip: {},
    legend: { data: ['Team A', 'Team B'], itemGap: 40, top: 0 },
    radar: {
      indicator: [
        { name: 'Performance', max: 100 },
        { name: 'Reliability', max: 100 },
        // ...
      ],
      shape: 'circle',
      splitArea: { show: false },
    },
    series: [
      {
        type: 'radar',
        data: [
          { value: [92, 85, 88, 95, 78], name: 'Team A' },
          { value: [78, 92, 75, 80, 95], name: 'Team B' },
        ],
        areaStyle: { opacity: 0.1 },
      },
    ],
  }}
/>
```

## Layout Pattern

Wrap charts in Card components:

```tsx
import { Card } from '@/components/ui/Card';
import { EChart } from '@/components/charts/EChart';

<Card variant="elevated">
  <Card.Header title="Chart Title" description="Brief description" />
  <Card.Content>
    <EChart height={300} option={...} />
  </Card.Content>
</Card>
```

Grid layout for multiple charts:

```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{/* chart cards */}</div>
```

## Legend Spacing

When using legends with multiple items, always set `itemGap` and adjust `grid.top`:

```tsx
legend: { data: [...], itemGap: 40, top: 0 },  // Horizontal
legend: { orient: 'vertical', itemGap: 30 },    // Vertical (donut/pie)
grid: { top: 50 },                               // Push chart down below legend
```

## Rules

- Always use `<EChart>` wrapper, never raw `echarts-for-react` or `echarts`
- Never hardcode colors — the wrapper reads CSS variables automatically
- Use `itemStyle: { borderRadius: [4, 4, 0, 0] }` for rounded bar tops
- Default height is 350px; use 300px for grid layouts
- The wrapper uses SVG renderer (`opts={{ renderer: 'svg' }}`)
- Type: `EChartsOption` from `echarts` for option typing
