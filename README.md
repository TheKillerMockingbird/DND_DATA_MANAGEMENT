# D&D Campaign Manager MVP

A REST API for managing tabletop role-playing game campaigns. This MVP focuses on the core backend features required for the final project: relational data, CRUD endpoints, middleware, error handling, and basic tests.

## Project Overview

This API helps Dungeon Masters and players organize campaigns, characters, and session notes in one place. It solves the problem of keeping campaign information scattered across notebooks, chats, and spreadsheets by storing everything in a structured database.

## Tech Stack

- Node.js
- Express.js
- Sequelize ORM
- SQLite
- Jest
- Supertest
- Morgan

## Features

- 3 related database tables
- Full CRUD for campaigns, characters, and sessions
- Proper RESTful routes and HTTP status codes
- Basic request logging
- Error handling middleware
- Sample seed data
- Unit tests for core endpoints

## Setup

Install dependencies:

```bash
npm install
```

If you do not already have the test dependencies, install them with:

```bash
npm install supertest --save-dev
```

## Run the App

Start the API:

```bash
npm start
```

Or run in development mode:

```bash
npm run dev
```

The server will run at:

```bash
http://localhost:3000
```

## Seed the Database

This project includes a seed script with realistic sample data for all resource types.

Run:

```bash
npm run seed
```

This will clear the database, recreate the tables, and insert sample campaigns, characters, and sessions.

## Test the API

Run unit tests with:

```bash
npm test
```

## Data Model

### Campaign
Stores each D&D campaign.

Fields:
- `id`
- `name`
- `description`
- `setting`
- `createdAt`
- `updatedAt`

### Character
Stores player characters tied to a campaign.

Fields:
- `id`
- `name`
- `characterClass`
- `race`
- `level`
- `notes`
- `campaignId`
- `createdAt`
- `updatedAt`

### Session
Stores session summaries tied to a campaign.

Fields:
- `id`
- `sessionDate`
- `summary`
- `nextSteps`
- `campaignId`
- `createdAt`
- `updatedAt`

## Relationships

- One campaign has many characters
- One campaign has many sessions
- Each character belongs to one campaign
- Each session belongs to one campaign

## API Endpoints

All responses are JSON.

### Campaigns

#### GET /campaigns
Returns all campaigns with related characters and sessions.

Example response:
```json
[
  {
    "id": 1,
    "name": "Lost Mines of Phandelver",
    "description": "A classic starter campaign...",
    "setting": "Forgotten Realms",
    "characters": [],
    "sessions": []
  }
]
```

#### GET /campaigns/:id
Returns one campaign by ID.

Required parameter:
- `id` in the URL path

#### POST /campaigns
Creates a new campaign.

Required body:
```json
{
  "name": "New Campaign",
  "description": "Campaign description",
  "setting": "Forgotten Realms"
}
```

Successful response: `201 Created`

#### PUT /campaigns/:id
Updates an existing campaign.

Required parameter:
- `id` in the URL path

Optional body fields:
- `name`
- `description`
- `setting`

#### DELETE /campaigns/:id
Deletes a campaign and any related records.

Successful response: `204 No Content`

#### GET /campaigns/:id/characters
Returns all characters for a campaign.

#### GET /campaigns/:id/sessions
Returns all sessions for a campaign.

### Characters

#### GET /characters
Returns all characters with their related campaign.

#### GET /characters/:id
Returns one character by ID.

#### POST /characters
Creates a new character.

Required body:
```json
{
  "name": "Aelar",
  "characterClass": "Wizard",
  "race": "Elf",
  "level": 3,
  "notes": "Likes old books",
  "campaignId": 1
}
```

Required fields:
- `name`
- `characterClass`
- `campaignId`

#### PUT /characters/:id
Updates an existing character.

#### DELETE /characters/:id
Deletes a character.

### Sessions

#### GET /sessions
Returns all sessions with their related campaign.

#### GET /sessions/:id
Returns one session by ID.

#### POST /sessions
Creates a new session.

Required body:
```json
{
  "sessionDate": "2026-04-12",
  "summary": "The party explored the tower.",
  "nextSteps": "Search the lower chamber",
  "campaignId": 1
}
```

Required fields:
- `sessionDate`
- `summary`
- `campaignId`

#### PUT /sessions/:id
Updates an existing session.

#### DELETE /sessions/:id
Deletes a session.

## Status Codes

- `200 OK` — Successful GET or PUT request
- `201 Created` — Successful POST request
- `204 No Content` — Successful DELETE request
- `400 Bad Request` — Invalid or missing data
- `404 Not Found` — Resource not found
- `500 Internal Server Error` — Unexpected server error

## Example Error Response

```json
{
  "message": "Campaign not found"
}
```

## Folder Structure

```bash
src/
├─ app.js
├─ server.js
├─ config/
│  └─ db.js
├─ middleware/
│  └─ errorHandler.js
├─ models/
│  ├─ index.js
│  ├─ Campaign.js
│  ├─ Character.js
│  └─ Session.js
├─ routes/
│  ├─ campaignRoutes.js
│  ├─ characterRoutes.js
│  └─ sessionRoutes.js
└─ seed.js

tests/
└─ api.test.js
```
