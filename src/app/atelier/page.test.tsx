// src/app/atelier/page.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AtelierPage from './page';
import * as api from '../../lib/api';

// Mock the Header component
vi.mock('../../components/Header', () => ({
  __esModule: true,
  default: () => <header>Mocked Header</header>,
}));

// Mock the generateUI API function
vi.mock('../../lib/api', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        generateUI: vi.fn(),
    };
});

const mockedGenerateUI = vi.mocked(api.generateUI);

describe('Atelier Page', () => {
  it('renders the form elements correctly', () => {
    render(<AtelierPage />);
    expect(
      screen.getByPlaceholderText(
        "Describe the UI you want to generate, e.g., 'A user profile card with an avatar, name, and a follow button.'",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Generate UI' })).toBeInTheDocument();
  });

  it('allows user to type in the prompt textarea', async () => {
    render(<AtelierPage />);
    const textarea = screen.getByPlaceholderText(
      "Describe the UI you want to generate, e.g., 'A user profile card with an avatar, name, and a follow button.'",
    );
    await fireEvent.change(textarea, { target: { value: 'A new button' } });
    expect(textarea).toHaveValue('A new button');
  });

    it('shows a loading state when generating UI', async () => {
        mockedGenerateUI.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve('<div>Generated Content</div>'), 100)));

        render(<AtelierPage />);

        const textarea = screen.getByPlaceholderText(/Describe the UI/);
        await fireEvent.change(textarea, { target: { value: 'A simple div' } });

        const button = screen.getByRole('button', { name: 'Generate UI' });
        fireEvent.click(button);

        expect(screen.getByText('Generating...')).toBeInTheDocument();
        expect(button).toBeDisabled();

        await waitFor(() => {
            expect(screen.getByTitle('Generated UI')).toBeInTheDocument();
        });
    });

  it('displays the generated UI on successful API call', async () => {
    const mockHtml = '<h1>Success!</h1>';
    mockedGenerateUI.mockResolvedValue(mockHtml);

    render(<AtelierPage />);

    const textarea = screen.getByPlaceholderText(/Describe the UI/);
    await fireEvent.change(textarea, { target: { value: 'A success message' } });

    fireEvent.click(screen.getByRole('button', { name: 'Generate UI' }));

    await waitFor(() => {
      const iframe = screen.getByTitle('Generated UI') as HTMLIFrameElement;
      expect(iframe).toBeInTheDocument();
      expect(iframe).toHaveAttribute('srcDoc', mockHtml);
    });
  });

  it('displays an error message on API failure', async () => {
    const error = new api.ApiError('Service Unavailable', 503);
    mockedGenerateUI.mockRejectedValue(error);

    render(<AtelierPage />);

    const textarea = screen.getByPlaceholderText(/Describe the UI/);
    await fireEvent.change(textarea, { target: { value: 'This will fail' } });

    fireEvent.click(screen.getByRole('button', { name: 'Generate UI' }));

    await waitFor(() => {
      expect(
        screen.getByText(
          'Service Unavailable: Service Unavailable. The AI service may be temporarily down.',
        ),
      ).toBeInTheDocument();
    });
  });
});
