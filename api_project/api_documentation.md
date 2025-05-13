# Agentic System RESTful API Documentation

## Introduction

This document provides detailed information about the RESTful APIs for the Agentic System. These APIs enable communication between the frontend and backend, supporting functionalities such as user management, project management, and more.

## Base URL

All URLs referenced in the documentation have the following base:

```
http://localhost:3000
```

## Authentication

Most endpoints require authentication using a JSON Web Token (JWT). Include the token in the `Authorization` header as follows:

```
Authorization: Bearer <your_token>
```

## Error Responses

All error responses follow a standard format:

```json
{
  "error": "Error message"
}
```

Validation errors include detailed information:

```json
{
  "errors": [
    {
      "value": "invalid_value",
      "msg": "Error message",
      "param": "parameter_name",
      "location": "body"
    }
  ]
}
```

## API Endpoints

### Authentication

#### Login

- **URL**: `/auth/login`
- **Method**: `POST`
- **Headers**:
  - `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content Example**:
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```
- **Error Response**:
  - **Code**: 400 Bad Request
    - **Content**: `{ "errors": [...] }` (if validation fails)
  - **Code**: 401 Unauthorized
    - **Content**: `{ "error": "Invalid credentials" }`

### User Management

#### Create User

- **URL**: `/users`
- **Method**: `POST`
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <your_token>`
- **Required Role**: `admin`
- **Request Body**:
  ```json
  {
    "username": "string (min length: 5)",
    "password": "string (min length: 8)",
    "role": "string (valid values: 'admin', 'project_manager', 'technical_lead', 'support_engineer')"
  }
  ```
- **Success Response**:
  - **Code**: 201 Created
  - **Content Example**:
    ```json
    {
      "id": 1,
      "username": "johndoe",
      "password": "password123",
      "role": "admin"
    }
    ```
- **Error Response**:
  - **Code**: 400 Bad Request
    - **Content**: `{ "errors": [...] }` (if validation fails)
  - **Code**: 401 Unauthorized
    - **Content**: `{ "error": "Authentication token required" }`
  - **Code**: 403 Forbidden
    - **Content**: `{ "error": "Unauthorized access" }`

#### Get User by ID

- **URL**: `/users/{id}`
- **Method**: `GET`
- **Headers**:
  - `Authorization: Bearer <your_token>`
- **Required Role**: `admin`
- **URL Parameters**:
  - `id`: Integer (User ID)
- **Success Response**:
  - **Code**: 200 OK
  - **Content Example**:
    ```json
    {
      "id": 1,
      "username": "johndoe",
      "password": "password123",
      "role": "admin"
    }
    ```
- **Error Response**:
  - **Code**: 401 Unauthorized
    - **Content**: `{ "error": "Authentication token required" }`
  - **Code**: 403 Forbidden
    - **Content**: `{ "error": "Unauthorized access" }`
  - **Code**: 404 Not Found
    - **Content**: `{ "error": "User not found" }`

### Project Management

#### Create Project

- **URL**: `/projects`
- **Method**: `POST`
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <your_token>`
- **Required Role**: `admin` or `project_manager`
- **Request Body**:
  ```json
  {
    "name": "string",
    "description": "string",
    "owner_id": "integer"
  }
  ```
- **Success Response**:
  - **Code**: 201 Created
  - **Content Example**:
    ```json
    {
      "id": 1,
      "name": "New Project",
      "description": "A new project description",
      "owner_id": 1,
      "created_at": "2025-05-08T12:00:00.000Z"
    }
    ```
- **Error Response**:
  - **Code**: 400 Bad Request
    - **Content**: `{ "errors": [...] }` (if validation fails)
  - **Code**: 401 Unauthorized
    - **Content**: `{ "error": "Authentication token required" }`
  - **Code**: 403 Forbidden
    - **Content**: `{ "error": "Unauthorized access" }`

#### Get All Projects

- **URL**: `/projects`
- **Method**: `GET`
- **Headers**:
  - `Authorization: Bearer <your_token>`
- **Success Response**:
  - **Code**: 200 OK
  - **Content Example**:
    ```json
    [
      {
        "id": 1,
        "name": "New Project",
        "description": "A new project description",
        "owner_id": 1,
        "created_at": "2025-05-08T12:00:00.000Z"
      }
    ]
    ```
- **Error Response**:
  - **Code**: 401 Unauthorized
    - **Content**: `{ "error": "Authentication token required" }`

#### Get Project by ID

- **URL**: `/projects/{id}`
- **Method**: `GET`
- **Headers**:
  - `Authorization: Bearer <your_token>`
- **URL Parameters**:
  - `id`: Integer (Project ID)
- **Success Response**:
  - **Code**: 200 OK
  - **Content Example**:
    ```json
    {
      "id": 1,
      "name": "New Project",
      "description": "A new project description",
      "owner_id": 1,
      "created_at": "2025-05-08T12:00:00.000Z"
    }
    ```
- **Error Response**:
  - **Code**: 401 Unauthorized
    - **Content**: `{ "error": "Authentication token required" }`
  - **Code**: 404 Not Found
    - **Content**: `{ "error": "Project not found" }`

#### Update Project

- **URL**: `/projects/{id}`
- **Method**: `PUT`
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <your_token>`
- **Required Role**: `admin` or `project_manager`
- **URL Parameters**:
  - `id`: Integer (Project ID)
- **Request Body**:
  ```json
  {
    "name": "string",
    "description": "string",
    "owner_id": "integer"
  }
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content Example**:
    ```json
    {
      "id": 1,
      "name": "Updated Project",
      "description": "An updated project description",
      "owner_id": 1,
      "created_at": "2025-05-08T12:00:00.000Z",
      "updated_at": "2025-05-09T12:00:00.000Z"
    }
    ```
- **Error Response**:
  - **Code**: 400 Bad Request
    - **Content**: `{ "errors": [...] }` (if validation fails)
  - **Code**: 401 Unauthorized
    - **Content**: `{ "error": "Authentication token required" }`
  - **Code**: 403 Forbidden
    - **Content**: `{ "error": "Unauthorized access" }`
  - **Code**: 404 Not Found
    - **Content**: `{ "error": "Project not found" }`
