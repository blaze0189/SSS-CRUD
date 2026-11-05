# Shopping Server

A beginner-friendly Express.js REST API that serves two in-memory product collections — snacks and electronics. Built as a teaching tool for learning how to create GET routes, use dynamic route parameters (`:id`), and work with query parameters (`req.query`).

## Learning Objectives

- Build GET routes in Express.js
- Use dynamic route parameters (`:id`) to look up items
- Use query parameters (`req.query`) for filtering and sorting

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm (comes with Node.js)

## Getting Started

### Install dependencies

```bash
npm install
```

### Start the server

```bash
npm start
```

Runs the server with `node index.js` on **http://localhost:3000**.

### Start in dev mode

```bash
npm run dev
```

Uses nodemon for auto-restart on each file change.

### Run tests

```bash
npm test
```

Tests run with Vitest.

## Available Routes

### `GET /` — All products

Returns both collections as an object.

```
GET http://localhost:3000/
```

Response (truncated):

```json
{
  "snacks": [
    { "id": 1, "name": "Chips", "price": 2.99, "quantity": 50 },
    { "id": 2, "name": "Cookies", "price": 3.49, "quantity": 30 },
    ...
  ],
  "electronics": [
    { "id": 1, "name": "Headphones", "price": 29.99, "quantity": 20 },
    { "id": 2, "name": "USB Cable", "price": 9.99, "quantity": 100 },
    ...
  ]
}
```

Filter by category:

```
GET http://localhost:3000/?category=snacks
```

### `GET /snacks` — All snacks (10 items)

```
GET http://localhost:3000/snacks
```

### `GET /snacks/:id` — Single snack by ID

```
GET http://localhost:3000/snacks/1
```

Response:

```json
{ "id": 1, "name": "Chips", "price": 2.99, "quantity": 50 }
```

Returns `{ "error": "Item not found" }` if the ID doesn't exist.

### `GET /electronics` — All electronics (10 items)

```
GET http://localhost:3000/electronics
```

### `GET /electronics/:id` — Single electronic by ID

```
GET http://localhost:3000/electronics/2
```

Response:

```json
{ "id": 2, "name": "USB Cable", "price": 9.99, "quantity": 100 }
```

Returns `{ "error": "Item not found" }` if the ID doesn't exist.

## Query Parameters

These work on `GET /`, `GET /snacks`, and `GET /electronics`:

| Param | Values | Example | Description |
|---|---|---|---|
| `maxPrice` | Any positive number | `?maxPrice=5` | Only return items with price ≤ value |
| `sort` | `asc` or `desc` | `?sort=asc` | Sort results by price |
| `category` | `snacks` or `electronics` | `?category=snacks` | (root route only) Filter by collection |

You can combine them:

```
GET http://localhost:3000/snacks?maxPrice=3&sort=asc
GET http://localhost:3000/?category=electronics&sort=desc
GET http://localhost:3000/?maxPrice=20&sort=asc
```

Invalid values return an error JSON response.
"# SSS-CRUD" 
