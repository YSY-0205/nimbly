# nimbly To-Do

A React app with authentication and to-do management. Uses [DummyJSON](https://dummyjson.com) for API interactions.

## Features

- Login with username/password
- Logout
- Persisted session (auth token stored in localStorage)
- To-dos list with pagination (10 per page)
- Error handling for API calls
- Unit tests

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Run

```bash
npm run dev
```

Open http://localhost:5173

### Build

```bash
npm run build
npm run preview
```

### Test

```bash
npm run test
```

## Test Credentials

Use any credentials from [dummyjson.com/users](https://dummyjson.com/users).

**Test user (15 todos for pagination):**
- Username: `testuser`
- Password: `testuser`

**Example DummyJSON user:**
- Username: `emilys`
- Password: `emilyspass`

## Tech Stack

- React 19
- Vite 7
- React Router 7
- Vitest + Testing Library
