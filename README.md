# Microgreens Tracking API

A comprehensive API for tracking microgreens growth, maintaining phenological records, and managing microgreens beds.

## Features

- User authentication and authorization
- Microgreens bed management
- Phenological journal with photo uploads
- Plant library with growing recommendations
- Automated notifications and reminders
- Analytics and tracking

## Prerequisites

- Docker and Docker Compose
- Go 1.21 or later (for local development)

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd microgreens-api
```

2. Create a `.env` file in the root directory with the following variables:
```env
DB_HOST=db
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=microgreens
DB_PORT=5432
JWT_SECRET=your-secret-key
```

3. Start the services using Docker Compose:
```bash
docker-compose up --build
```

The API will be available at `http://localhost:8080`

## API Endpoints

### Authentication
- `POST /api/v1/register` - Register a new user
- `POST /api/v1/login` - Login and get JWT token

### User Profile
- `GET /api/v1/user/profile` - Get user profile
- `PUT /api/v1/user/profile` - Update user profile

### Beds Management
- `POST /api/v1/beds` - Create a new bed
- `GET /api/v1/beds` - Get all user's beds
- `GET /api/v1/beds/:id` - Get specific bed
- `PUT /api/v1/beds/:id` - Update bed
- `DELETE /api/v1/beds/:id` - Delete bed

### Records
- `POST /api/v1/beds/:id/records` - Create a new record
- `GET /api/v1/beds/:id/records` - Get bed records
- `PUT /api/v1/records/:id` - Update record
- `DELETE /api/v1/records/:id` - Delete record

### Plant Library
- `GET /api/v1/plants` - Get all plants
- `GET /api/v1/plants/:id` - Get specific plant info

### Notifications
- `GET /api/v1/notifications` - Get user notifications
- `PUT /api/v1/notifications/:id/read` - Mark notification as read

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-token>
```

## Development

To run the API locally:

1. Install dependencies:
```bash
cd api
go mod download
```

2. Start the database:
```bash
docker-compose up db
```

3. Run the API:
```bash
go run .
```

## License

MIT License 