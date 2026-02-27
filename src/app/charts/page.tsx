import { ChartsDemo } from './_charts-demo';

export default function ChartsPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-(--color-fg)">Charts</h1>
        <p className="mt-2 text-(--color-fg-muted)">
          Data visualization demos powered by Apache ECharts with automatic theme integration.
        </p>
      </div>

      <ChartsDemo />
    </div>
  );
}
