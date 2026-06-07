# Multi-Tool API

Backend-first full-stack project built with Java and Spring Boot, designed as a learning playground for production-grade backend practices.

The current module focuses on task management and demonstrates layered architecture, DTO separation, request validation, database migrations, and centralized error handling.

## Project Goals

This project is being developed to learn backend engineering in a way that reflects everyday corporate practices, including:

- layered architecture (`controller -> service -> repository`)
- DTO-based API contracts
- request validation with `jakarta.validation`
- centralized exception handling
- database versioning with Flyway
- OpenAPI / Swagger documentation
- clean REST endpoint design

## Tech Stack

### Backend

- Java 25
- Spring Boot 4.x
- Spring Web MVC
- Spring Data JPA
- PostgreSQL
- Flyway
- Maven
- Swagger / OpenAPI
- Lombok

### Frontend

- React
- Vite
- Node.js / npm

## Architecture

The backend follows a layered architecture:

- **Controller** — handles HTTP requests and responses
- **Service** — contains business logic
- **Repository** — handles data access
- **DTO** — separates API contracts from persistence entities
- **Exception layer** — provides centralized error handling

Current package structure:

```text
src/main/java/com/devacademy/multitool_api/
├── controller
├── dto
├── exception
├── model
├── repository
└── service
```

## Features

### Task Management

The current module supports the full task lifecycle:

- creating a task
- fetching all tasks
- fetching a task by ID
- updating a task
- deleting a task

### Validation

Incoming request payloads are validated using `jakarta.validation`.

Examples:

- title cannot be blank
- title must contain 3–100 characters
- description cannot be blank
- status must be one of: `TODO`, `IN_PROGRESS`, `DONE`

### Error Handling

The API uses centralized exception handling with `@RestControllerAdvice` and returns structured error responses using Spring `ProblemDetail`.

Handled scenarios include:

- `400 Bad Request` for validation errors
- `404 Not Found` when a task does not exist
- `500 Internal Server Error` for unexpected failures

## API Endpoints

### Task Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tasks` | Create a new task |
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/{id}` | Get a single task by ID |
| PUT | `/api/tasks/{id}` | Update an existing task |
| DELETE | `/api/tasks/{id}` | Delete a task |

## Example Requests

### Create Task

```http
POST /api/tasks
Content-Type: application/json
```

```json
{
  "title": "Prepare backend refactor",
  "description": "Clean up service layer and improve exception handling",
  "status": "TODO"
}
```

### Update Task

```http
PUT /api/tasks/1
Content-Type: application/json
```

```json
{
  "title": "Prepare backend refactor v2",
  "description": "Refactor DTO mapping and improve API consistency",
  "status": "IN_PROGRESS"
}
```

## Example Response

```json
{
  "id": 1,
  "title": "Prepare backend refactor",
  "description": "Clean up service layer and improve exception handling",
  "status": "TODO",
  "createdAt": "2026-06-07T18:15:22"
}
```

## Example Error Responses

### Validation Error

```json
{
  "type": "about:blank",
  "title": "Validation Failed",
  "status": 400,
  "detail": "Żądanie zawiera nieprawidłowe dane",
  "instance": "/api/tasks",
  "timestamp": "2026-06-07T18:20:12.123Z",
  "errors": {
    "title": "Tytul nie moze byc pusty!",
    "description": "Opis nie moze byc pusty!"
  }
}
```

### Resource Not Found

```json
{
  "type": "about:blank",
  "title": "Resource Not Found",
  "status": 404,
  "detail": "Task with id 999 not found",
  "instance": "/api/tasks/999",
  "timestamp": "2026-06-07T18:22:10.456Z"
}
```

## Getting Started

To run the full application, start the backend and frontend separately.

### Backend

From the project root:

```bash
make run
```

Available commands:

| Command | Description |
|--------|-------------|
| `make run` | Start PostgreSQL container and run Spring Boot app |
| `make db` | Start or create PostgreSQL container |
| `make db-stop` | Stop PostgreSQL container |
| `make app` | Run Spring Boot app only |

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

- `http://localhost:5173`

The Vite development server proxies `/api` requests to the backend, which simplifies local development.

## API Documentation

After starting the backend, Swagger UI is available at:

[http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

## Database Configuration

The project uses PostgreSQL running in Docker.

Default connection parameters:

- Host: `localhost`
- Port: `5432`
- Database: `multitooldb`
- Username: `postgres`
- Password: `postgres`

Database schema changes are managed with Flyway migrations located in:

```text
src/main/resources/db/migration/
```

## Current Learning Scope

This repository is being expanded incrementally to practice production-style backend development.

The current focus areas include:

- REST API design
- DTO mapping
- validation
- exception handling
- persistence layer design

Planned next steps include:

- pagination and filtering
- status-only update endpoint (`PATCH`)
- testing (`@WebMvcTest`, integration tests)
- Spring Security + JWT
- auditing
- structured logging

## Notes

This repository is intentionally developed step by step as a learning project.

The goal is not only to make the application work, but also to understand why specific architectural decisions are used in real-world backend systems.
