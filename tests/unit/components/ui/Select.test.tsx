import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SimpleSelect } from '@components/ui/Select';

const options = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
];

describe('SimpleSelect', () => {
  it('renders with a trigger', () => {
    render(<SimpleSelect options={options} placeholder="Select a country" />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('shows placeholder text', () => {
    render(<SimpleSelect options={options} placeholder="Select a country" />);
    expect(screen.getByText('Select a country')).toBeInTheDocument();
  });

  it('renders label linked to trigger', () => {
    render(<SimpleSelect options={options} label="Country" />);
    const label = screen.getByText('Country');
    const trigger = screen.getByRole('combobox');
    expect(label).toHaveAttribute('for', trigger.id);
  });

  it('shows error message', () => {
    render(<SimpleSelect options={options} error="Required" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
  });

  it('sets aria-invalid when error is present', () => {
    render(<SimpleSelect options={options} error="Error" />);
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('shows helper text', () => {
    render(<SimpleSelect options={options} helperText="Pick one" />);
    expect(screen.getByText('Pick one')).toBeInTheDocument();
  });

  it('hides helper text when error is shown', () => {
    render(<SimpleSelect options={options} error="Error" helperText="Help" />);
    expect(screen.queryByText('Help')).not.toBeInTheDocument();
  });

  it('disables the trigger', () => {
    render(<SimpleSelect options={options} disabled />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('renders with a default value', () => {
    render(<SimpleSelect options={options} defaultValue="uk" />);
    expect(screen.getByText('United Kingdom')).toBeInTheDocument();
  });

  it('sets aria-describedby for error', () => {
    render(<SimpleSelect options={options} error="Err" id="my-select" />);
    const trigger = screen.getByRole('combobox');
    expect(trigger.getAttribute('aria-describedby')).toContain('error');
  });
});
