import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserTodos } from '../api/client';
import './TodosPage.css';

const ITEMS_PER_PAGE = 10;

export default function TodosPage() {
  const { user, token, logout } = useAuth();
  const [todos, setTodos] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(function() {
    if (!user || !user.id || !token) return;

    setLoading(true);
    setError(null);

    async function load() {
      try {
        const data = await getUserTodos(user.id, token, {
          limit: ITEMS_PER_PAGE,
          skip: page * ITEMS_PER_PAGE,
        });
        setTodos(data.todos || []);
        setTotal(data.total || 0);
      } catch (err) {
        setError(err.message || 'Failed to load todos. Please try again.');
      }
      setLoading(false);
    }
    load();
  }, [user && user.id, token, page]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE) || 1;
  const hasPrev = page > 0;
  const hasNext = page < totalPages - 1;

  return (
    <div className="todos-page">
      <header className="todos-header">
        <div className="todos-header-content">
          <div className="user-info">
            {user && user.image && (
              <img
                src={user.image}
                alt=""
                className="user-avatar"
                width={40}
                height={40}
              />
            )}
            <div>
              <h1>My To-Dos</h1>
              <p className="user-name">
                {user && user.firstName} {user && user.lastName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="logout-btn"
            aria-label="Log out"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="todos-main">
        {error && (
          <div className="todos-error" role="alert">
            {error}
          </div>
        )}

        {loading && (
          <div className="todos-loading">
            <div className="spinner" aria-hidden />
            <p>Loading your to-dos...</p>
          </div>
        )}
        {!loading && todos.length === 0 && (
          <div className="todos-empty">
            <p>No to-dos yet.</p>
          </div>
        )}
        {!loading && todos.length > 0 && (
          <div>
            <ul className="todos-list" aria-label="To-do list">
              {todos.map(function(todo) {
                return (
                <li key={todo.id} className="todo-item">
                  <span
                    className={'todo-text ' + (todo.completed ? 'completed' : '')}
                  >
                    {todo.todo}
                  </span>
                  <span
                    className={'todo-badge ' + (todo.completed ? 'done' : 'pending')}
                    aria-label={todo.completed ? 'Completed' : 'Pending'}
                  >
                    {todo.completed ? 'Done' : 'Pending'}
                  </span>
                </li>
                );
              })}
            </ul>

            {totalPages > 1 && (
              <nav
                className="pagination"
                aria-label="Pagination"
              >
                <button
                  type="button"
                  onClick={function() { setPage(page - 1 < 0 ? 0 : page - 1); }}
                  disabled={!hasPrev}
                  aria-label="Previous page"
                >
                  Previous
                </button>
                <span className="pagination-info">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={function() { setPage(page + 1 > totalPages - 1 ? totalPages - 1 : page + 1); }}
                  disabled={!hasNext}
                  aria-label="Next page"
                >
                  Next
                </button>
              </nav>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
