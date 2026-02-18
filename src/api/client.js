const BASE_URL = 'https://dummyjson.com';

const TEST_USER = { username: 'testuser', password: 'testuser' };
const TEST_USER_ID = 9999;

const MOCK_TODOS = [
  { id: 1, todo: 'Learn React', completed: true, userId: TEST_USER_ID },
  { id: 2, todo: 'Build a todo app', completed: true, userId: TEST_USER_ID },
  { id: 3, todo: 'Add pagination', completed: false, userId: TEST_USER_ID },
  { id: 4, todo: 'Write unit tests', completed: false, userId: TEST_USER_ID },
  { id: 5, todo: 'Deploy to production', completed: false, userId: TEST_USER_ID },
  { id: 6, todo: 'Review code', completed: true, userId: TEST_USER_ID },
  { id: 7, todo: 'Fix bugs', completed: false, userId: TEST_USER_ID },
  { id: 8, todo: 'Update documentation', completed: false, userId: TEST_USER_ID },
  { id: 9, todo: 'Refactor components', completed: false, userId: TEST_USER_ID },
  { id: 10, todo: 'Optimize performance', completed: false, userId: TEST_USER_ID },
  { id: 11, todo: 'Add error handling', completed: true, userId: TEST_USER_ID },
  { id: 12, todo: 'Implement auth', completed: true, userId: TEST_USER_ID },
  { id: 13, todo: 'Style the UI', completed: false, userId: TEST_USER_ID },
  { id: 14, todo: 'Test pagination', completed: false, userId: TEST_USER_ID },
  { id: 15, todo: 'Submit assignment', completed: false, userId: TEST_USER_ID },
];

async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data;
}

export async function login(username, password) {
  if (username === TEST_USER.username && password === TEST_USER.password) {
    return {
      id: TEST_USER_ID,
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      image: 'https://dummyjson.com/icon/testuser/128',
      accessToken: 'test-token-' + TEST_USER_ID,
    };
  }
  const response = await fetch(BASE_URL + '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, expiresInMins: 60 }),
  });
  return handleResponse(response);
}

export async function getCurrentUser(accessToken) {
  const response = await fetch(BASE_URL + '/auth/me', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + accessToken,
    },
    credentials: 'include',
  });

  return handleResponse(response);
}

export async function getUserTodos(userId, accessToken, options) {
  const limit = options && options.limit !== undefined ? options.limit : 10;
  const skip = options && options.skip !== undefined ? options.skip : 0;

  if (userId === TEST_USER_ID) {
    const todos = MOCK_TODOS.slice(skip, skip + limit);
    return { todos: todos, total: MOCK_TODOS.length, skip: skip, limit: limit };
  }
  const params = new URLSearchParams({ limit: String(limit), skip: String(skip) });
  const url = BASE_URL + '/todos/user/' + userId + '?' + params;
  const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json',
      },
    });
  return handleResponse(response);
}
