import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { Input } from '@components/ui/Input';

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input placeholder="Type here" />);
    expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument();
  });

  it('renders label linked to input via htmlFor', () => {
    render(<Input label="Email" />);
    const label = screen.getByText('Email');
    const input = screen.getByRole('textbox');
    expect(label).toHaveAttribute('for', input.id);
  });

  it('shows error message with role=alert', () => {
    render(<Input error="Required field" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Required field');
  });

  it('sets aria-invalid when there is an error', () => {
    render(<Input error="Invalid" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('sets aria-describedby for error', () => {
    render(<Input error="Error msg" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-describedby');
    const describedById = input.getAttribute('aria-describedby')!;
    expect(document.getElementById(describedById)).toHaveTextContent('Error msg');
  });

  it('shows helper text', () => {
    render(<Input helperText="Some help" />);
    expect(screen.getByText('Some help')).toBeInTheDocument();
  });

  it('hides helper text when error is present', () => {
    render(<Input error="Error" helperText="Help" />);
    expect(screen.queryByText('Help')).not.toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('renders left and right addons', () => {
    render(
      <Input
        leftAddon={<span data-testid="left-addon">@</span>}
        rightAddon={<span data-testid="right-addon">.com</span>}
      />
    );
    expect(screen.getByTestId('left-addon')).toBeInTheDocument();
    expect(screen.getByTestId('right-addon')).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('handles user typing', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input onChange={onChange} />);
    await user.type(screen.getByRole('textbox'), 'hello');
    expect(onChange).toHaveBeenCalled();
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('uses provided id', () => {
    render(<Input id="custom-id" label="Custom" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'custom-id');
  });
});
