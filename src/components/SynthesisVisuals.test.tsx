import React from 'react';
import { render, screen } from '@testing-library/react';
import SynthesisVisuals from './SynthesisVisuals';

// Mock framer-motion
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  const MockedDiv = React.forwardRef(({ children, ...props }, ref) => (
    <div {...props} ref={ref}>
      {children}
    </div>
  ));
  MockedDiv.displayName = 'MockedDiv';

  const MockedLine = React.forwardRef(({ children, ...props }, ref) => (
    <line {...props} ref={ref}>
      {children}
    </line>
  ));
  MockedLine.displayName = 'MockedLine';

  return {
    ...actual,
    motion: {
      ...actual.motion,
      div: MockedDiv,
      line: MockedLine,
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
  };
});

describe('SynthesisVisuals', () => {
  it('renders all items in a faded state by default', () => {
    render(<SynthesisVisuals />);
    
    // Check that a key item and a non-key item are rendered
    expect(screen.getByText('Email: Q3 Report Draft')).toBeInTheDocument();
    expect(screen.getByText('Slack: @channel please review')).toBeInTheDocument();

    // In the default state, the connecting lines should not be visible
    expect(screen.queryByTestId('synthesis-connections')).not.toBeInTheDocument();
  });

  it('renders in a synthesized state with connections when initialState is "synthesized"', () => {
    render(<SynthesisVisuals initialState="synthesized" />);

    // In the synthesized state, the connecting lines should be visible
    const connectionsSgv = screen.getByTestId('synthesis-connections');
    expect(connectionsSgv).toBeInTheDocument();
    
    // Check that there are 3 connection lines
    expect(connectionsSgv.children.length).toBe(3);
  });
});
