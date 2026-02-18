import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import LoginPage from './LoginPage';

// Mock AuthContext
const mockLogin = vi.fn();
const mockSetError = vi.fn();
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    isAuthenticated: false,
    error: null,
    setError: mockSetError,
  }),
}));

// Mock API
vi.mock('../api/client', () => ({
  login: vi.fn(),
}));

import { login as apiLogin } from '../api/client';

function renderLoginPage() {
  return render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form', () => {
    renderLoginPage();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows error when username is empty', async () => {
    const user = userEvent.setup();
    renderLoginPage();
    const submitBtn = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitBtn);
    expect(screen.getByText(/username is required/i)).toBeInTheDocument();
    expect(apiLogin).not.toHaveBeenCalled();
  });

  it('shows error when password is empty', async () => {
    const user = userEvent.setup();
    renderLoginPage();
    await user.type(screen.getByLabelText(/username/i), 'emilys');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    expect(apiLogin).not.toHaveBeenCalled();
  });

  it('calls API and login on success', async () => {
    const user = userEvent.setup();
    apiLogin.mockResolvedValueOnce({
      id: 1,
      username: 'emilys',
      firstName: 'Emily',
      lastName: 'Johnson',
      image: 'https://example.com/img.png',
      accessToken: 'token123',
    });

    const { container } = render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/username/i), 'emilys');
    await user.type(screen.getByLabelText(/password/i), 'emilyspass');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await expect(apiLogin).toHaveBeenCalledWith('emilys', 'emilyspass');
    expect(mockLogin).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        username: 'emilys',
        firstName: 'Emily',
        lastName: 'Johnson',
        image: 'https://example.com/img.png',
      }),
      'token123'
    );
  });

  it('shows error on API failure', async () => {
    const user = userEvent.setup();
    apiLogin.mockRejectedValueOnce(new Error('Invalid credentials'));

    renderLoginPage();
    await user.type(screen.getByLabelText(/username/i), 'wrong');
    await user.type(screen.getByLabelText(/password/i), 'wrong');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });
});
