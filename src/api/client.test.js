import { describe, it, expect, vi, beforeEach } from 'vitest';
import { login, getCurrentUser, getUserTodos } from './client';

describe('API client', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  describe('login', () => {
    it('returns user and token on success', async () => {
      const mockResponse = {
        id: 1,
        username: 'emilys',
        accessToken: 'token123',
        refreshToken: 'refresh123',
      };
      fetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve(mockResponse),
      });

      const result = await login('emilys', 'emilyspass');

      expect(fetch).toHaveBeenCalledWith(
        'https://dummyjson.com/auth/login',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: 'emilys',
            password: 'emilyspass',
            expiresInMins: 60,
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('throws error on failed login', async () => {
      const headers = new Headers({ 'content-type': 'application/json' });
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        headers,
        json: () => Promise.resolve({ message: 'Invalid credentials' }),
      });

      try {
        await login('wrong', 'wrong');
      } catch (err) {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe('Invalid credentials');
      }
    });
  });

  describe('getCurrentUser', () => {
    it('includes Authorization header', async () => {
      const mockUser = { id: 1, username: 'emilys' };
      fetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve(mockUser),
      });

      await getCurrentUser('my-token');

      expect(fetch).toHaveBeenCalledWith(
        'https://dummyjson.com/auth/me',
        expect.objectContaining({
          method: 'GET',
          headers: { Authorization: 'Bearer my-token' },
        })
      );
    });
  });

  describe('getUserTodos', () => {
    it('uses limit and skip for pagination', async () => {
      const mockData = { todos: [], total: 0 };
      fetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve(mockData),
      });

      await getUserTodos(5, 'token', { limit: 10, skip: 20 });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('limit=10'),
        expect.any(Object)
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('skip=20'),
        expect.any(Object)
      );
    });
  });
});
