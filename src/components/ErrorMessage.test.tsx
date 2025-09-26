import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ErrorMessage from './ErrorMessage';

describe('ErrorMessage', () => {
  it('renders the default title and message', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('renders a custom title', () => {
    render(<ErrorMessage title="Custom Title" message="Test error message" />);
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  it('renders the error code when provided', () => {
    render(<ErrorMessage message="Test error message" code="500" />);
    expect(screen.getByText('Code: 500')).toBeInTheDocument();
  });

  it('does not render the error code when not provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.queryByText(/Code:/)).not.toBeInTheDocument();
  });
});
