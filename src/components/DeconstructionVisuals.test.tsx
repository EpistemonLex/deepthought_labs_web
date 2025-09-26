import React from 'react';
import { render, screen } from '@testing-library/react';
import DeconstructionVisuals from './DeconstructionVisuals';

// Mock framer-motion to avoid animation complexities in tests
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  const MockedDiv = React.forwardRef(({ children, ...props }, ref) => (
    <div {...props} ref={ref}>
      {children}
    </div>
  ));
  MockedDiv.displayName = 'MockedDiv';
  return {
    ...actual,
    motion: {
      ...actual.motion,
      div: MockedDiv,
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
  };
});

describe('DeconstructionVisuals', () => {
  it('renders items in a chaos state by default', () => {
    render(<DeconstructionVisuals />);
    
    // Check for a few items to confirm they are rendered
    expect(screen.getByText('Email: Q3 Report Draft')).toBeInTheDocument();
    expect(screen.getByText('Chart: User Growth YoY')).toBeInTheDocument();
    
    // In the chaos state, bucket titles should not be visible
    expect(screen.queryByText('Comms')).not.toBeInTheDocument();
  });

  it('renders in a sorted state when the initialState prop is set to "sorted"', () => {
    render(<DeconstructionVisuals initialState="sorted" />);

    // The sorted state should be rendered immediately
    expect(screen.getByText('Comms')).toBeInTheDocument();
    expect(screen.getByText('Tasks')).toBeInTheDocument();
    expect(screen.getByText('Data')).toBeInTheDocument();
    expect(screen.getByText('Ideas')).toBeInTheDocument();

    // Check that items are in the correct buckets
    const commsBucket = screen.getByText('Comms').parentElement;
    const tasksBucket = screen.getByText('Tasks').parentElement;

    // @ts-expect-error - parentElement can be null, but we expect it to exist
    expect(commsBucket).toHaveTextContent('Email: Q3 Report Draft');
    // @ts-expect-error - parentElement can be null, but we expect it to exist
    expect(commsBucket).not.toHaveTextContent('Chart: User Growth YoY');
    
    // @ts-expect-error - parentElement can be null, but we expect it to exist
    expect(tasksBucket).toHaveTextContent('TODO: Update dependencies');
    // @ts-expect-error - parentElement can be null, but we expect it to exist
    expect(tasksBucket).not.toHaveTextContent('Email: Q3 Report Draft');
  });
});
