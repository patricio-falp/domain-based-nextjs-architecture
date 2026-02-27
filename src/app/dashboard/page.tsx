import { Card } from '@components/ui/Card';

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-(--color-fg)">Dashboard</h1>
        <p className="mt-2 text-(--color-fg-muted)">Welcome to your application dashboard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="elevated">
          <Card.Header
            title="Getting Started"
            description="This is a starter template with auth and themes."
          />
          <Card.Content>
            <p className="text-sm text-(--color-fg-muted)">
              Edit this page to start building your application.
            </p>
          </Card.Content>
        </Card>

        <Card variant="elevated">
          <Card.Header title="Components" description="Pre-built UI components ready to use." />
          <Card.Content>
            <p className="text-sm text-(--color-fg-muted)">
              Badge, Button, Card, Checkbox, DataTable, Input, Modal, Select, Skeleton, Spinner,
              Tabs, and more.
            </p>
          </Card.Content>
        </Card>

        <Card variant="elevated">
          <Card.Header title="Features" description="Built-in infrastructure for common needs." />
          <Card.Content>
            <ul className="text-sm text-(--color-fg-muted) space-y-1">
              <li>Keycloak OAuth authentication</li>
              <li>Light/Dark/System theme</li>
              <li>Zustand state management</li>
              <li>React Query for server state</li>
            </ul>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
