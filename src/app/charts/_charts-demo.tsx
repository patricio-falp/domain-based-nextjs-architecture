'use client';

import { useState } from 'react';
import { Card } from '@components/ui/Card';
import { EChart } from '@components/charts/EChart';

// ── Line Chart ──────────────────────────────────────────────────────────────

function LineChartDemo() {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  return (
    <EChart
      height={300}
      option={{
        tooltip: { trigger: 'axis' },
        legend: { data: ['Revenue', 'Expenses'], itemGap: 40, top: 0 },
        grid: { top: 50 },
        xAxis: { type: 'category', data: months, boundaryGap: false },
        yAxis: { type: 'value' },
        series: [
          {
            name: 'Revenue',
            type: 'line',
            smooth: true,
            data: [820, 932, 901, 1234, 1290, 1330, 1520, 1430, 1650, 1890, 2100, 2340],
          },
          {
            name: 'Expenses',
            type: 'line',
            smooth: true,
            data: [620, 732, 701, 834, 890, 930, 1020, 1130, 1150, 1290, 1380, 1520],
          },
        ],
      }}
    />
  );
}

// ── Bar Chart ───────────────────────────────────────────────────────────────

function BarChartDemo() {
  return (
    <EChart
      height={300}
      option={{
        tooltip: { trigger: 'axis' },
        legend: { data: ['2024', '2025'], itemGap: 40, top: 0 },
        grid: { top: 50 },
        xAxis: {
          type: 'category',
          data: ['Q1', 'Q2', 'Q3', 'Q4'],
        },
        yAxis: { type: 'value' },
        series: [
          {
            name: '2024',
            type: 'bar',
            barGap: '10%',
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
  );
}

// ── Pie / Donut Chart ───────────────────────────────────────────────────────

function PieChartDemo() {
  return (
    <EChart
      height={300}
      option={{
        tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
        legend: { orient: 'vertical', right: 10, top: 'center', itemGap: 30 },
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['40%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: { borderRadius: 6, borderColor: 'transparent', borderWidth: 2 },
            label: { show: false },
            emphasis: { label: { show: true, fontWeight: 'bold' } },
            data: [
              { value: 1048, name: 'Organic' },
              { value: 735, name: 'Direct' },
              { value: 580, name: 'Referral' },
              { value: 484, name: 'Social' },
              { value: 300, name: 'Email' },
            ],
          },
        ],
      }}
    />
  );
}

// ── Area Chart ──────────────────────────────────────────────────────────────

function AreaChartDemo() {
  const days = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);
  const data = [
    150, 230, 224, 218, 335, 347, 260, 284, 312, 345, 378, 356, 420, 390, 445, 467, 512, 534, 498,
    567, 590, 612, 580, 645, 678, 712, 698, 745, 780, 823,
  ];

  return (
    <EChart
      height={300}
      option={{
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: days,
          boundaryGap: false,
          axisLabel: {
            formatter: (_: string, index: number) => (index % 5 === 0 ? `Day ${index + 1}` : ''),
          },
        },
        yAxis: { type: 'value' },
        series: [
          {
            type: 'line',
            smooth: true,
            data,
            areaStyle: { opacity: 0.15 },
            lineStyle: { width: 2 },
          },
        ],
      }}
    />
  );
}

// ── Scatter Chart ───────────────────────────────────────────────────────────

function ScatterChartDemo() {
  // Generate random correlated data (memoized to avoid impure render calls)
  const [dataA] = useState(() =>
    Array.from({ length: 40 }, () => [
      Math.round(Math.random() * 100),
      Math.round(Math.random() * 80 + 20),
    ])
  );
  const [dataB] = useState(() =>
    Array.from({ length: 40 }, () => [
      Math.round(Math.random() * 100),
      Math.round(Math.random() * 60 + 10),
    ])
  );

  return (
    <EChart
      height={300}
      option={{
        tooltip: { trigger: 'item' },
        legend: { data: ['Group A', 'Group B'], itemGap: 40, top: 0 },
        grid: { top: 50 },
        xAxis: { type: 'value', name: 'X Axis' },
        yAxis: { type: 'value', name: 'Y Axis' },
        series: [
          {
            name: 'Group A',
            type: 'scatter',
            data: dataA,
            symbolSize: 10,
          },
          {
            name: 'Group B',
            type: 'scatter',
            data: dataB,
            symbolSize: 10,
          },
        ],
      }}
    />
  );
}

// ── Radar Chart ─────────────────────────────────────────────────────────────

function RadarChartDemo() {
  return (
    <EChart
      height={300}
      option={{
        tooltip: {},
        legend: { data: ['Team A', 'Team B'], itemGap: 40, top: 0 },
        radar: {
          indicator: [
            { name: 'Performance', max: 100 },
            { name: 'Reliability', max: 100 },
            { name: 'Security', max: 100 },
            { name: 'Usability', max: 100 },
            { name: 'Scalability', max: 100 },
            { name: 'Documentation', max: 100 },
          ],
          shape: 'circle',
          splitArea: { show: false },
        },
        series: [
          {
            type: 'radar',
            data: [
              { value: [92, 85, 88, 95, 78, 82], name: 'Team A' },
              { value: [78, 92, 75, 80, 95, 90], name: 'Team B' },
            ],
            areaStyle: { opacity: 0.1 },
          },
        ],
      }}
    />
  );
}

// ── Exported Demo Component ─────────────────────────────────────────────────

export function ChartsDemo() {
  const charts = [
    {
      title: 'Line Chart',
      description: 'Monthly revenue and expenses trend',
      component: <LineChartDemo />,
    },
    {
      title: 'Bar Chart',
      description: 'Quarterly comparison year over year',
      component: <BarChartDemo />,
    },
    {
      title: 'Donut Chart',
      description: 'Traffic source distribution',
      component: <PieChartDemo />,
    },
    {
      title: 'Area Chart',
      description: '30-day active users growth',
      component: <AreaChartDemo />,
    },
    {
      title: 'Scatter Plot',
      description: 'Correlation between two variables',
      component: <ScatterChartDemo />,
    },
    {
      title: 'Radar Chart',
      description: 'Multi-dimensional team comparison',
      component: <RadarChartDemo />,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {charts.map((chart) => (
        <Card key={chart.title} variant="elevated">
          <Card.Header title={chart.title} description={chart.description} />
          <Card.Content>{chart.component}</Card.Content>
        </Card>
      ))}
    </div>
  );
}
