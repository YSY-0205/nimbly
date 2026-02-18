import { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEYS = {
  USER: 'nimbly_user',
  TOKEN: 'nimbly_token',
};

const AuthContext = createContext(null);

function loadStoredAuth() {
  try {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (user && token) {
      return { user: JSON.parse(user), token: token };
    }
  } catch (e) {
    console.error('Failed to load stored auth:', e);
  }
  return null;
}

function saveAuth(user, token) {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
}

function clearAuth() {
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const stored = loadStoredAuth();
    if (stored) {
      setUser(stored.user);
      setToken(stored.token);
    }
    setLoading(false);
  }, []);

  function login(userData, accessToken) {
    saveAuth(userData, accessToken);
    setUser(userData);
    setToken(accessToken);
    setError(null);
  }

  function logout() {
    clearAuth();
    setUser(null);
    setToken(null);
  }

  const value = {
    user,
    token,
    loading,
    error,
    setError,
    login,
    logout,
    isAuthenticated: user !== null && token !== null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
