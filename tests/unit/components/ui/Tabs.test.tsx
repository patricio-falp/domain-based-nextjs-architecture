import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs } from '@components/ui/Tabs';

describe('Tabs', () => {
  const renderTabs = (props = {}) =>
    render(
      <Tabs defaultValue="tab1" {...props}>
        <Tabs.List>
          <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
          <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
          <Tabs.Trigger value="tab3" disabled>
            Tab 3
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tab1">Content 1</Tabs.Content>
        <Tabs.Content value="tab2">Content 2</Tabs.Content>
        <Tabs.Content value="tab3">Content 3</Tabs.Content>
      </Tabs>
    );

  it('renders with default tab selected', () => {
    renderTabs();
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('has correct ARIA roles', () => {
    renderTabs();
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(3);
    expect(screen.getByRole('tabpanel')).toBeInTheDocument();
  });

  it('sets aria-selected on active tab', () => {
    renderTabs();
    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('aria-selected', 'false');
  });

  it('switches tab on click', async () => {
    const user = userEvent.setup();
    renderTabs();

    await user.click(screen.getByRole('tab', { name: 'Tab 2' }));

    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('does not switch to disabled tab', async () => {
    const user = userEvent.setup();
    renderTabs();

    await user.click(screen.getByRole('tab', { name: 'Tab 3' }));

    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('calls onValueChange in controlled mode', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Tabs value="tab1" onValueChange={onValueChange}>
        <Tabs.List>
          <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
          <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tab1">Content 1</Tabs.Content>
        <Tabs.Content value="tab2">Content 2</Tabs.Content>
      </Tabs>
    );

    await user.click(screen.getByRole('tab', { name: 'Tab 2' }));
    expect(onValueChange).toHaveBeenCalledWith('tab2');
  });

  it('navigates with ArrowRight keyboard', async () => {
    const user = userEvent.setup();
    renderTabs();

    const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
    tab1.focus();

    await user.keyboard('{ArrowRight}');

    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('navigates with ArrowLeft keyboard', async () => {
    const user = userEvent.setup();
    renderTabs();

    // First switch to Tab 2
    await user.click(screen.getByRole('tab', { name: 'Tab 2' }));
    const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
    tab2.focus();

    await user.keyboard('{ArrowLeft}');

    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('links tab triggers to panels via aria-controls', () => {
    renderTabs();
    const trigger = screen.getByRole('tab', { name: 'Tab 1' });
    const panelId = trigger.getAttribute('aria-controls');
    expect(panelId).toBeTruthy();
    expect(screen.getByRole('tabpanel')).toHaveAttribute('id', panelId);
  });
});
