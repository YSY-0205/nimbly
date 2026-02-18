import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../api/client';
import './LoginPage.css';

export default function LoginPage() {
  const { login, isAuthenticated, error, setError } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/todos" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLocalError('');

    if (!username.trim()) {
      setLocalError('Username is required');
      return;
    }
    if (!password) {
      setLocalError('Password is required');
      return;
    }

    setSubmitting(true);
    try {
      const data = await loginApi(username.trim(), password);
      if (!data.accessToken) {
        throw new Error('No access token received');
      }
      login(
        {
          id: data.id,
          username: data.username,
          firstName: data.firstName,
          lastName: data.lastName,
          image: data.image,
        },
        data.accessToken
      );
      navigate('/todos', { replace: true });
    } catch (err) {
      const message = err.message || 'Invalid credentials. Please try again.';
      setLocalError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const displayError = localError || error;

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome back</h1>
          <p>Sign in to manage your to-dos</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {displayError && (
            <div className="login-error" role="alert">
              {displayError}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={function(e) { setUsername(e.target.value); }}
              placeholder="Username"
              autoComplete="username"
              disabled={submitting}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={function(e) { setPassword(e.target.value); }}
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={submitting}
            />
          </div>

          <button type="submit" className="login-btn" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
