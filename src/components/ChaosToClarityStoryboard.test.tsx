import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ChaosToClarityStoryboard from './ChaosToClarityStoryboard';

// Mock the child components
vi.mock('./DeconstructionVisuals', () => ({
  __esModule: true,
  default: () => <div>Deconstruction Visuals</div>,
}));

vi.mock('./SynthesisVisuals', () => ({
  __esModule: true,
  default: () => <div>Synthesis Visuals</div>,
}));

describe('ChaosToClarityStoryboard', () => {
  it('renders all the main sections', () => {
    render(<ChaosToClarityStoryboard />);

    expect(screen.getByText('First, We Deconstruct.')).toBeInTheDocument();
    expect(screen.getByText('Then, We Synthesize.')).toBeInTheDocument();
    expect(screen.getByText('Next, We Compose.')).toBeInTheDocument();
    expect(
      screen.getByText('Finally, We Iterate Toward Clarity.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Experience the Full Power of Symbiosis.'),
    ).toBeInTheDocument();
  });
});
