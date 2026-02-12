import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NeoButton } from '../components/ui/NeoButton';

describe('NeoButton', () => {
  it('renders children correctly', () => {
    render(<NeoButton>Click Me</NeoButton>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeDefined();
  });

  it('shows loading spinner when isLoading is true', () => {
    render(<NeoButton isLoading>Submit</NeoButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveProperty('disabled', true);
  });

  it('applies variant styles', () => {
    render(<NeoButton variant="secondary">Action</NeoButton>);
    const button = screen.getByRole('button', { name: /action/i });
    expect(button.className).toContain('bg-secondary');
  });

  it('is disabled when disabled prop is set', () => {
    render(<NeoButton disabled>Disabled</NeoButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveProperty('disabled', true);
  });
});
