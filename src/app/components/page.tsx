'use client';

import { useState } from 'react';
import { Badge } from '@components/ui/Badge';
import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';
import { Checkbox } from '@components/ui/Checkbox';
import { Input } from '@components/ui/Input';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogClose,
} from '@components/ui/Dialog';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
  SimpleSelect,
} from '@components/ui/Select';
import { Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard } from '@components/ui/Skeleton';
import { Spinner, SpinnerCentered } from '@components/ui/Spinner';
import { Tabs } from '@components/ui/Tabs';
import { DataTable, Pagination } from '@components/ui/DataTable';
import { HorizontalSplit } from '@components/ui/ResizablePanels';
import { Tooltip } from '@components/ui/Tooltip';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@components/ui/DropdownMenu';
import { Avatar } from '@components/ui/Avatar';
import { Alert } from '@components/ui/Alert';
import { Breadcrumbs } from '@components/ui/Breadcrumbs';
import { EmptyState } from '@components/ui/EmptyState';
import { toast } from '@/shared/stores/toast';
import { ReactQueryDemo } from './_react-query-demo';
import { FormDemo } from './_form-demo';
import {
  Search,
  Mail,
  Lock,
  Eye,
  Plus,
  Trash2,
  Download,
  Settings,
  AlertCircle,
  CheckCircle,
  User,
  Bell,
  Shield,
  Pencil,
  Copy,
  MoreHorizontal,
  FileText,
  FolderOpen,
} from 'lucide-react';

// ─── Section wrapper ────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-(--color-fg) border-b border-(--color-border) pb-2">
        {title}
      </h2>
      {children}
    </section>
  );
}

function SubSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-(--color-fg-muted)">{label}</h3>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

// ─── Sample data for DataTable ──────────────────────────────────────
interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
}

const sampleUsers: UserRow[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'active' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'active' },
  { id: '3', name: 'Carol White', email: 'carol@example.com', role: 'Viewer', status: 'inactive' },
  { id: '4', name: 'David Brown', email: 'david@example.com', role: 'Editor', status: 'pending' },
  { id: '5', name: 'Eve Davis', email: 'eve@example.com', role: 'Admin', status: 'active' },
];

// ─── Page ───────────────────────────────────────────────────────────
export default function ComponentsPage() {
  const [checkboxA, setCheckboxA] = useState(false);
  const [checkboxB, setCheckboxB] = useState(true);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-(--color-fg)">Component Showcase</h1>
        <p className="mt-2 text-(--color-fg-muted)">
          All UI components included in this template with their variants.
        </p>
      </div>

      {/* ── Buttons ──────────────────────────────────────────────── */}
      <Section title="Button">
        <SubSection label="Variants">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="outline">Outline</Button>
        </SubSection>

        <SubSection label="Sizes">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </SubSection>

        <SubSection label="States">
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
          <Button fullWidth variant="secondary">
            Full Width
          </Button>
        </SubSection>

        <SubSection label="With Icons">
          <Button leftIcon={<Plus className="w-4 h-4" />}>Create</Button>
          <Button variant="danger" leftIcon={<Trash2 className="w-4 h-4" />}>
            Delete
          </Button>
          <Button variant="secondary" rightIcon={<Download className="w-4 h-4" />}>
            Export
          </Button>
          <Button variant="ghost" leftIcon={<Settings className="w-4 h-4" />}>
            Settings
          </Button>
        </SubSection>
      </Section>

      {/* ── Badges ───────────────────────────────────────────────── */}
      <Section title="Badge">
        <SubSection label="Variants">
          <Badge variant="default">Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="info">Info</Badge>
        </SubSection>

        <SubSection label="With Dot">
          <Badge variant="success" dot>
            Active
          </Badge>
          <Badge variant="error" dot>
            Critical
          </Badge>
          <Badge variant="warning" dot>
            Pending
          </Badge>
          <Badge variant="info" dot>
            New
          </Badge>
        </SubSection>

        <SubSection label="Sizes">
          <Badge size="sm" variant="info">
            Small
          </Badge>
          <Badge size="md" variant="info">
            Medium
          </Badge>
        </SubSection>
      </Section>

      {/* ── Cards ────────────────────────────────────────────────── */}
      <Section title="Card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card variant="elevated">
            <Card.Header
              title="Elevated Card"
              description="With shadow and clean corners"
              actions={
                <Badge variant="success" dot>
                  Active
                </Badge>
              }
            />
            <Card.Content>
              <p className="text-sm text-(--color-fg-muted)">
                This is the default elevated card with subtle shadow.
              </p>
            </Card.Content>
            <Card.Footer>
              <Button size="sm" variant="secondary">
                Cancel
              </Button>
              <Button size="sm">Save</Button>
            </Card.Footer>
          </Card>

          <Card variant="outlined">
            <Card.Header title="Outlined Card" description="With border, no shadow" />
            <Card.Content>
              <p className="text-sm text-(--color-fg-muted)">
                A lighter variant with just a border.
              </p>
            </Card.Content>
          </Card>

          <Card variant="filled">
            <Card.Header title="Filled Card" description="With muted background" />
            <Card.Content>
              <p className="text-sm text-(--color-fg-muted)">
                Background-filled variant for grouping content.
              </p>
            </Card.Content>
          </Card>
        </div>

        <SubSection label="Hoverable">
          <Card variant="elevated" hoverable padding>
            <p className="text-sm text-(--color-fg-muted)">Hover over me for shadow effect</p>
          </Card>
        </SubSection>
      </Section>

      {/* ── Inputs ───────────────────────────────────────────────── */}
      <Section title="Input">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          <Input label="Default" placeholder="Enter text..." />
          <Input
            label="With Helper"
            placeholder="you@example.com"
            helperText="We'll never share your email"
          />
          <Input
            label="With Error"
            placeholder="Password"
            error="Password must be at least 8 characters"
          />
          <Input
            label="With Left Icon"
            placeholder="Search..."
            leftAddon={<Search className="w-4 h-4" />}
          />
          <Input
            label="With Right Icon"
            placeholder="Enter email"
            rightAddon={<Mail className="w-4 h-4" />}
          />
          <Input label="Disabled" placeholder="Can't edit this" disabled />
        </div>

        <SubSection label="Sizes">
          <Input size="sm" placeholder="Small" />
          <Input size="md" placeholder="Medium" />
          <Input size="lg" placeholder="Large" />
        </SubSection>
      </Section>

      {/* ── Form Validation ────────────────────────────────────────── */}
      <Section title="Form Validation">
        <p className="text-sm text-(--color-fg-muted)">
          React Hook Form + Zod schema validation. Validates on touch, shows inline errors, tracks
          dirty/valid state.
        </p>
        <FormDemo />
      </Section>

      {/* ── Dialog (Radix) ─────────────────────────────────────────── */}
      <Section title="Dialog">
        <SubSection label="Composable API (shadcn-style)">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="primary">Open Dialog</Button>
            </DialogTrigger>
            <DialogContent size="md">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you&apos;re done.
                </DialogDescription>
              </DialogHeader>
              <DialogBody>
                <div className="space-y-4">
                  <Input label="Name" placeholder="Enter your name" defaultValue="John Doe" />
                  <Input
                    label="Email"
                    placeholder="you@example.com"
                    defaultValue="john@example.com"
                  />
                </div>
              </DialogBody>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button>Save Changes</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="danger">Delete Account</Button>
            </DialogTrigger>
            <DialogContent size="sm">
              <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete your account and remove
                  your data from our servers.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="secondary">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button variant="danger">Yes, Delete</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Large Dialog</Button>
            </DialogTrigger>
            <DialogContent size="lg">
              <DialogHeader>
                <DialogTitle>Terms of Service</DialogTitle>
                <DialogDescription>Please review our terms before proceeding.</DialogDescription>
              </DialogHeader>
              <DialogBody>
                <div className="space-y-3 text-sm text-(--color-fg-muted)">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua.
                  </p>
                  <p>
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat.
                  </p>
                  <p>
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                    fugiat nulla pariatur.
                  </p>
                </div>
              </DialogBody>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="secondary">Decline</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button>Accept</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </SubSection>

        <SubSection label="Without close button">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost">No Close Button</Button>
            </DialogTrigger>
            <DialogContent size="sm" showCloseButton={false}>
              <DialogHeader>
                <DialogTitle>Confirm Action</DialogTitle>
                <DialogDescription>You must choose an option to continue.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="secondary">Go Back</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button>Continue</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </SubSection>
      </Section>

      {/* ── Select (Radix) ─────────────────────────────────────────── */}
      <Section title="Select">
        <SubSection label="Composable API (shadcn-style)">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-(--color-fg)">Framework</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a framework..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="next">Next.js</SelectItem>
                  <SelectItem value="remix">Remix</SelectItem>
                  <SelectItem value="astro">Astro</SelectItem>
                  <SelectItem value="svelte">SvelteKit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-(--color-fg)">Grouped Options</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Engineering</SelectLabel>
                    <SelectItem value="frontend">Frontend Developer</SelectItem>
                    <SelectItem value="backend">Backend Developer</SelectItem>
                    <SelectItem value="fullstack">Fullstack Developer</SelectItem>
                  </SelectGroup>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel>Design</SelectLabel>
                    <SelectItem value="ux">UX Designer</SelectItem>
                    <SelectItem value="ui">UI Designer</SelectItem>
                  </SelectGroup>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel>Management</SelectLabel>
                    <SelectItem value="pm">Product Manager</SelectItem>
                    <SelectItem value="em">Engineering Manager</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </SubSection>

        <SubSection label="SimpleSelect wrapper (quick API)">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
            <SimpleSelect
              label="Default"
              placeholder="Choose an option..."
              options={[
                { value: 'react', label: 'React' },
                { value: 'vue', label: 'Vue' },
                { value: 'angular', label: 'Angular' },
                { value: 'svelte', label: 'Svelte' },
              ]}
            />
            <SimpleSelect
              label="With Error"
              error="Please select a framework"
              placeholder="Select..."
              options={[
                { value: 'a', label: 'Option A' },
                { value: 'b', label: 'Option B' },
              ]}
            />
            <SimpleSelect
              label="With Helper"
              helperText="Choose your preferred framework"
              options={[
                { value: 'next', label: 'Next.js' },
                { value: 'remix', label: 'Remix' },
                { value: 'astro', label: 'Astro' },
              ]}
            />
            <SimpleSelect
              label="Disabled"
              disabled
              options={[{ value: 'disabled', label: 'Cannot change' }]}
            />
          </div>
        </SubSection>
      </Section>

      {/* ── Checkbox (Radix) ───────────────────────────────────────── */}
      <Section title="Checkbox">
        <SubSection label="States">
          <Checkbox label="Unchecked" checked={checkboxA} onChange={setCheckboxA} />
          <Checkbox label="Checked" checked={checkboxB} onChange={setCheckboxB} />
          <Checkbox label="Indeterminate" checked="indeterminate" />
          <Checkbox label="Disabled" disabled />
          <Checkbox label="Disabled Checked" checked disabled />
        </SubSection>

        <SubSection label="Sizes">
          <Checkbox label="Small" size="sm" checked onChange={() => {}} />
          <Checkbox label="Medium" size="md" checked onChange={() => {}} />
          <Checkbox label="Large" size="lg" checked onChange={() => {}} />
        </SubSection>
      </Section>

      {/* ── Tabs (Radix) ───────────────────────────────────────────── */}
      <Section title="Tabs">
        <SubSection label="Default">
          <Tabs defaultValue="general" className="w-full">
            <Tabs.List>
              <Tabs.Trigger value="general">General</Tabs.Trigger>
              <Tabs.Trigger value="settings" icon={<Settings className="w-4 h-4" />}>
                Settings
              </Tabs.Trigger>
              <Tabs.Trigger value="security" icon={<Lock className="w-4 h-4" />}>
                Security
              </Tabs.Trigger>
              <Tabs.Trigger value="disabled" disabled>
                Disabled
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="general">
              <Card variant="outlined" padding>
                <div className="space-y-3">
                  <p className="text-sm text-(--color-fg-muted)">
                    General settings content goes here.
                  </p>
                  <Input label="Display Name" placeholder="Enter your name" />
                </div>
              </Card>
            </Tabs.Content>
            <Tabs.Content value="settings">
              <Card variant="outlined" padding>
                <div className="space-y-3">
                  <p className="text-sm text-(--color-fg-muted)">
                    Application settings content goes here.
                  </p>
                  <div className="flex flex-col gap-2">
                    <Checkbox label="Enable notifications" checked onChange={() => {}} />
                    <Checkbox label="Dark mode by default" onChange={() => {}} />
                    <Checkbox label="Auto-save changes" checked onChange={() => {}} />
                  </div>
                </div>
              </Card>
            </Tabs.Content>
            <Tabs.Content value="security">
              <Card variant="outlined" padding>
                <div className="space-y-3">
                  <p className="text-sm text-(--color-fg-muted)">
                    Security settings content goes here.
                  </p>
                  <Input label="Current Password" placeholder="********" />
                  <Input label="New Password" placeholder="Enter new password" />
                </div>
              </Card>
            </Tabs.Content>
          </Tabs>
        </SubSection>

        <SubSection label="Icon-only Tabs">
          <Tabs defaultValue="profile" className="w-full">
            <Tabs.List>
              <Tabs.Trigger value="profile" icon={<User className="w-4 h-4" />}>
                Profile
              </Tabs.Trigger>
              <Tabs.Trigger value="notifications" icon={<Bell className="w-4 h-4" />}>
                Notifications
              </Tabs.Trigger>
              <Tabs.Trigger value="security" icon={<Shield className="w-4 h-4" />}>
                Security
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="profile">
              <Card variant="filled" padding>
                <p className="text-sm text-(--color-fg-muted)">Profile tab content.</p>
              </Card>
            </Tabs.Content>
            <Tabs.Content value="notifications">
              <Card variant="filled" padding>
                <p className="text-sm text-(--color-fg-muted)">Notifications tab content.</p>
              </Card>
            </Tabs.Content>
            <Tabs.Content value="security">
              <Card variant="filled" padding>
                <p className="text-sm text-(--color-fg-muted)">Security tab content.</p>
              </Card>
            </Tabs.Content>
          </Tabs>
        </SubSection>
      </Section>

      {/* ── Toast ────────────────────────────────────────────────── */}
      <Section title="Toast Notifications">
        <SubSection label="Trigger toasts">
          <Button
            variant="secondary"
            leftIcon={<CheckCircle className="w-4 h-4" />}
            onClick={() => toast.success('Operation completed successfully')}
          >
            Success
          </Button>
          <Button
            variant="secondary"
            leftIcon={<AlertCircle className="w-4 h-4" />}
            onClick={() => toast.error('Something went wrong')}
          >
            Error
          </Button>
          <Button variant="secondary" onClick={() => toast.warning('Please review your changes')}>
            Warning
          </Button>
          <Button variant="secondary" onClick={() => toast.info('New update available')}>
            Info
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              toast.success('Item saved', {
                title: 'Success!',
                action: { label: 'Undo', onClick: () => toast.info('Undo clicked') },
              })
            }
          >
            With Action
          </Button>
        </SubSection>
      </Section>

      {/* ── React Query ──────────────────────────────────────────── */}
      <Section title="React Query">
        <p className="text-sm text-(--color-fg-muted)">
          Live data from JSONPlaceholder API. Demonstrates useQuery, dependent queries,
          loading/error states, caching, and refetch.
        </p>
        <ReactQueryDemo />
      </Section>

      {/* ── Spinner ──────────────────────────────────────────────── */}
      <Section title="Spinner">
        <SubSection label="Sizes">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
          <Spinner size="xl" />
        </SubSection>

        <SubSection label="Centered (in container)">
          <div className="w-full h-32 border border-(--color-border) rounded-lg">
            <SpinnerCentered label="Loading data..." />
          </div>
        </SubSection>
      </Section>

      {/* ── Skeleton ─────────────────────────────────────────────── */}
      <Section title="Skeleton">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-(--color-fg-muted)">Basic Shapes</h3>
            <Skeleton width="100%" height="1rem" />
            <Skeleton width="80%" height="1rem" />
            <Skeleton width="60%" height="1rem" />
            <div className="flex gap-2 items-center">
              <SkeletonAvatar size="md" />
              <div className="flex-1 space-y-2">
                <Skeleton width="60%" height="0.875rem" />
                <Skeleton width="40%" height="0.75rem" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-(--color-fg-muted)">Text Block</h3>
            <SkeletonText lines={4} />
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-(--color-fg-muted)">Card</h3>
            <SkeletonCard />
          </div>
        </div>
      </Section>

      {/* ── DataTable ────────────────────────────────────────────── */}
      <Section title="DataTable">
        <Card variant="outlined">
          <Card.Content>
            <DataTable
              data={sampleUsers}
              keyExtractor={(u) => u.id}
              selectable
              selectedKeys={selectedRows}
              onSelectionChange={setSelectedRows}
              columns={[
                { id: 'name', header: 'Name', accessor: 'name', sortable: true },
                { id: 'email', header: 'Email', accessor: 'email', sortable: true },
                { id: 'role', header: 'Role', accessor: 'role' },
                {
                  id: 'status',
                  header: 'Status',
                  accessor: 'status',
                  cell: (row) => (
                    <Badge
                      variant={
                        row.status === 'active'
                          ? 'success'
                          : row.status === 'pending'
                            ? 'warning'
                            : 'error'
                      }
                      dot
                      size="sm"
                    >
                      {row.status}
                    </Badge>
                  ),
                },
              ]}
              actions={(row) => (
                <Button size="sm" variant="ghost" onClick={() => toast.info(`Clicked ${row.name}`)}>
                  <Eye className="w-4 h-4" />
                </Button>
              )}
              pagination={
                <Pagination
                  currentPage={1}
                  totalPages={1}
                  totalItems={sampleUsers.length}
                  itemsPerPage={20}
                  onPageChange={() => {}}
                />
              }
            />
          </Card.Content>
        </Card>
      </Section>

      {/* ── Resizable Panels ─────────────────────────────────────── */}
      <Section title="Resizable Panels">
        <div className="h-64 border border-(--color-border) rounded-lg overflow-hidden">
          <HorizontalSplit
            leftDefaultSize={40}
            leftMinSize={20}
            rightMinSize={20}
            leftPanel={
              <div className="h-full flex items-center justify-center bg-(--color-bg-subtle) p-4">
                <p className="text-sm text-(--color-fg-muted)">
                  Left Panel — drag the handle to resize
                </p>
              </div>
            }
            rightPanel={
              <div className="h-full flex items-center justify-center bg-(--color-bg-muted) p-4">
                <p className="text-sm text-(--color-fg-muted)">Right Panel</p>
              </div>
            }
          />
        </div>
      </Section>

      {/* ── Tooltip ──────────────────────────────────────────────── */}
      <Section title="Tooltip">
        <SubSection label="Positions">
          <Tooltip content="Top tooltip" side="top">
            <Button variant="secondary">Top</Button>
          </Tooltip>
          <Tooltip content="Right tooltip" side="right">
            <Button variant="secondary">Right</Button>
          </Tooltip>
          <Tooltip content="Bottom tooltip" side="bottom">
            <Button variant="secondary">Bottom</Button>
          </Tooltip>
          <Tooltip content="Left tooltip" side="left">
            <Button variant="secondary">Left</Button>
          </Tooltip>
        </SubSection>

        <SubSection label="With icon buttons">
          <Tooltip content="Edit">
            <Button variant="ghost" size="sm">
              <Pencil className="w-4 h-4" />
            </Button>
          </Tooltip>
          <Tooltip content="Copy to clipboard">
            <Button variant="ghost" size="sm">
              <Copy className="w-4 h-4" />
            </Button>
          </Tooltip>
          <Tooltip content="Delete item">
            <Button variant="ghost" size="sm">
              <Trash2 className="w-4 h-4" />
            </Button>
          </Tooltip>
        </SubSection>
      </Section>

      {/* ── Dropdown Menu ────────────────────────────────────────── */}
      <Section title="Dropdown Menu">
        <SubSection label="Basic">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" rightIcon={<MoreHorizontal className="w-4 h-4" />}>
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => toast.info('Edit clicked')}>
                <Pencil className="w-4 h-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info('Copy clicked')}>
                <Copy className="w-4 h-4" /> Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info('Download clicked')}>
                <Download className="w-4 h-4" /> Download
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-(--color-error)"
                onClick={() => toast.error('Delete clicked')}
              >
                <Trash2 className="w-4 h-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SubSection>
      </Section>

      {/* ── Avatar ───────────────────────────────────────────────── */}
      <Section title="Avatar">
        <SubSection label="Sizes">
          <Avatar name="John Doe" size="sm" />
          <Avatar name="John Doe" size="md" />
          <Avatar name="John Doe" size="lg" />
          <Avatar name="John Doe" size="xl" />
        </SubSection>

        <SubSection label="Variants">
          <Avatar name="Alice Johnson" />
          <Avatar name="Bob Smith" />
          <Avatar name="Carol" />
          <Avatar />
        </SubSection>

        <SubSection label="With Image">
          <Avatar src="https://i.pravatar.cc/150?u=a" name="User A" size="md" />
          <Avatar src="https://i.pravatar.cc/150?u=b" name="User B" size="md" />
          <Avatar src="https://i.pravatar.cc/150?u=c" name="User C" size="md" />
        </SubSection>
      </Section>

      {/* ── Alert ────────────────────────────────────────────────── */}
      <Section title="Alert">
        <div className="space-y-3 max-w-2xl">
          <Alert variant="info" title="Information">
            This is an informational message with useful details.
          </Alert>
          <Alert variant="success" title="Success!">
            Your changes have been saved successfully.
          </Alert>
          <Alert variant="warning" title="Warning">
            Please review your changes before proceeding.
          </Alert>
          <Alert variant="error" title="Error">
            Something went wrong. Please try again later.
          </Alert>
          <Alert variant="info" dismissible onDismiss={() => toast.info('Alert dismissed')}>
            This alert can be dismissed by clicking the X button.
          </Alert>
        </div>
      </Section>

      {/* ── Breadcrumbs ──────────────────────────────────────────── */}
      <Section title="Breadcrumbs">
        <div className="space-y-4">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Components' }]} />
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Settings', href: '/settings' },
              { label: 'Profile', href: '/profile' },
              { label: 'Edit' },
            ]}
          />
        </div>
      </Section>

      {/* ── Empty State ──────────────────────────────────────────── */}
      <Section title="Empty State">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card variant="outlined">
            <EmptyState
              title="No items found"
              description="Try adjusting your search or filters to find what you're looking for."
              action={
                <Button size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                  Create Item
                </Button>
              }
            />
          </Card>
          <Card variant="outlined">
            <EmptyState
              icon={<FolderOpen className="w-12 h-12" />}
              title="No documents"
              description="Upload a document to get started."
              action={
                <Button size="sm" variant="secondary" leftIcon={<FileText className="w-4 h-4" />}>
                  Upload
                </Button>
              }
            />
          </Card>
        </div>
      </Section>

      {/* ── Color Palette ────────────────────────────────────────── */}
      <Section title="Color Palette">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Primary', bg: 'bg-(--color-primary)', fg: 'text-(--color-primary-fg)' },
            { label: 'Secondary', bg: 'bg-(--color-secondary)', fg: 'text-(--color-secondary-fg)' },
            { label: 'Success', bg: 'bg-(--color-success)', fg: 'text-(--color-success-fg)' },
            { label: 'Warning', bg: 'bg-(--color-warning)', fg: 'text-(--color-warning-fg)' },
            { label: 'Error', bg: 'bg-(--color-error)', fg: 'text-(--color-error-fg)' },
            { label: 'Info', bg: 'bg-(--color-info)', fg: 'text-(--color-info-fg)' },
            { label: 'Background', bg: 'bg-(--color-bg)', fg: 'text-(--color-fg)' },
            { label: 'Muted', bg: 'bg-(--color-bg-muted)', fg: 'text-(--color-fg)' },
          ].map((color) => (
            <div
              key={color.label}
              className={`${color.bg} ${color.fg} rounded-xl p-4 text-center text-sm font-medium border border-(--color-border)`}
            >
              {color.label}
            </div>
          ))}
        </div>

        <SubSection label="Semantic Muted Backgrounds">
          <div className="flex flex-wrap gap-3">
            {[
              {
                label: 'Success Muted',
                bg: 'bg-(--color-success-muted)',
                fg: 'text-(--color-success)',
              },
              {
                label: 'Warning Muted',
                bg: 'bg-(--color-warning-muted)',
                fg: 'text-(--color-warning)',
              },
              { label: 'Error Muted', bg: 'bg-(--color-error-muted)', fg: 'text-(--color-error)' },
              { label: 'Info Muted', bg: 'bg-(--color-info-muted)', fg: 'text-(--color-info)' },
              {
                label: 'Primary Muted',
                bg: 'bg-(--color-primary-muted)',
                fg: 'text-(--color-primary)',
              },
            ].map((color) => (
              <div
                key={color.label}
                className={`${color.bg} ${color.fg} rounded-lg px-4 py-2 text-sm font-medium`}
              >
                {color.label}
              </div>
            ))}
          </div>
        </SubSection>
      </Section>

      {/* ── Typography ───────────────────────────────────────────── */}
      <Section title="Typography">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-(--color-fg)">Heading 1 (4xl bold)</h1>
          <h2 className="text-3xl font-bold text-(--color-fg)">Heading 2 (3xl bold)</h2>
          <h3 className="text-2xl font-semibold text-(--color-fg)">Heading 3 (2xl semibold)</h3>
          <h4 className="text-xl font-semibold text-(--color-fg)">Heading 4 (xl semibold)</h4>
          <h5 className="text-lg font-medium text-(--color-fg)">Heading 5 (lg medium)</h5>
          <p className="text-base text-(--color-fg)">
            Body text (base) — The quick brown fox jumps over the lazy dog.
          </p>
          <p className="text-sm text-(--color-fg-muted)">
            Small muted text — Secondary information and descriptions.
          </p>
          <p className="text-xs text-(--color-fg-subtle)">
            Extra small subtle text — Timestamps and meta info.
          </p>
          <code className="text-sm font-mono bg-(--color-bg-muted) px-2 py-1 rounded">
            Monospace code
          </code>
        </div>
      </Section>
    </div>
  );
}
