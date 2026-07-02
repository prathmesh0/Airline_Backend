# Airline Backend

A backend service for an **Airline Management System**, built with [Node.js](https://nodejs.org/) and [Express 5](https://expressjs.com/). The project follows a clean, layered architecture (routes → controllers → services → repositories) that keeps concerns separated and makes the codebase easy to scale as new features are added.

> **Status:** Early scaffolding. The base structure, configuration, logging, database ORM (Sequelize), and a sample `info` endpoint are in place. Business logic (services, repositories) and database models are being added.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [Folder Structure](#folder-structure)
- [Architecture Overview](#architecture-overview)
- [API Reference](#api-reference)
- [Code Style & Linting](#code-style--linting)

---

## Tech Stack

| Category         | Package             | Purpose                                        |
| ---------------- | ------------------- | ---------------------------------------------- |
| Runtime          | Node.js             | JavaScript runtime                             |
| Web Framework    | `express` (v5)      | HTTP server and routing                        |
| Database ORM     | `sequelize`         | SQL ORM for MySQL                              |
| Database Driver  | `mysql2`            | MySQL database driver                          |
| Configuration    | `dotenv`            | Loads environment variables from `.env`        |
| Logging          | `winston`           | Structured logging to console and file         |
| HTTP Helpers     | `http-status-codes` | Human-readable HTTP status code constants      |
| Dev Server       | `nodemon`           | Auto-restart on file changes                   |
| Linting          | `eslint`            | Static code analysis                           |
| Formatting       | `prettier`          | Consistent code formatting                     |
| Migrations       | `sequelize-cli`     | Database migrations and seeders                |

---

## Getting Started

### Prerequisites

- **Node.js** (LTS recommended)
- **npm** (ships with Node.js)
- **MySQL** (8.0+ recommended)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd "Airline Backend"

# Install dependencies
npm install
```

### Configuration

Create a `.env` file in the project root (see [Environment Variables](#environment-variables)):

```env
PORT=3000
DB_USERNAME=root
DB_PASSWORD=
DB_NAME=airline_db
DB_HOST=127.0.0.1
DB_DIALECT=mysql
```

### Running the Server

```bash
# Start the development server (with auto-reload)
npm run dev
```

Once running, the server listens on the port defined in `.env` (default `3000`). Verify it with:

```bash
curl http://localhost:3000/api/v1/info
```

---

## Available Scripts

| Script                 | Description                                         |
| ---------------------- | --------------------------------------------------- |
| `npm run dev`          | Starts the server with `nodemon` (auto-reloads)     |
| `npm run lint`         | Runs ESLint across the project                      |
| `npm run lint:fix`     | Runs ESLint and auto-fixes issues where possible    |
| `npm run format`       | Formats all files with Prettier                     |
| `npm run format:check` | Checks formatting without writing changes           |

---

## Environment Variables

| Variable       | Description                         | Example               |
| -------------- | --------------------------------- | --------------------- |
| `PORT`         | Port the HTTP server binds to     | `3000`                |
| `DB_USERNAME`  | MySQL username                    | `root`                |
| `DB_PASSWORD`  | MySQL password                    |                       |
| `DB_NAME`      | MySQL database name               | `airline_db`          |
| `DB_HOST`      | MySQL host                        | `127.0.0.1`          |
| `DB_DIALECT`   | Database dialect                  | `mysql`               |

> The `.env` file is git-ignored. Never commit secrets to version control.

---

## Database

The project uses **MySQL** with **Sequelize ORM**. Database connection settings are configured in `src/config/config.json` for development, test, and production environments.

### Setting Up the Database

1. Ensure MySQL is running on your system.
2. Create the database:
   ```bash
   npx sequelize-cli db:create
   ```
3. Run pending migrations (once migrations are added):
   ```bash
   npx sequelize-cli db:migrate
   ```
4. (Optional) Seed the database:
   ```bash
   npx sequelize-cli db:seed:all
   ```

### Generating Migrations & Models

```bash
# Generate a model (creates model file + migration)
npx sequelize-cli model:generate --name Airplane --attributes modelName:string,capacity:integer

# Generate a migration file
npx sequelize-cli migration:generate --name add-new-column

# Generate a seeder file
npx sequelize-cli seed:generate --name demo-airplanes
```

---

## Folder Structure

```
Airline Backend/
├── src/
│   ├── config/               # App configuration & third-party setup
│   │   ├── index.js          # Barrel export for all config modules
│   │   ├── server-config.js  # Loads env vars (PORT, etc.) via dotenv
│   │   ├── logger-config.js  # Winston logger (console + combined.log)
│   │   └── config.json       # Sequelize database connection config
│   │
│   ├── controllers/          # Request handlers (parse req, send res)
│   │   ├── index.js          # Barrel export for all controllers
│   │   └── info-controller.js# Sample health/info endpoint handler
│   │
│   ├── routes/               # API route definitions
│   │   ├── index.js          # Mounts versioned routers (e.g. /v1)
│   │   └── v1/
│   │       └── index.js      # Version 1 routes
│   │
│   ├── middlewares/          # Custom Express middleware (validation, auth…)
│   │   └── index.js          # Barrel export (placeholder)
│   │
│   ├── services/             # Business logic layer
│   │   └── index.js          # Barrel export (placeholder)
│   │
│   ├── repositories/         # Data-access layer (DB queries)
│   │   └── index.js          # Barrel export (placeholder)
│   │
│   ├── models/               # Sequelize model definitions
│   │   └── index.js          # Model loader (auto-imports all models)
│   │
│   ├── migrations/           # Database migration files
│   │
│   ├── seeders/              # Database seeder files
│   │
│   └── index.js              # App entry point — creates & starts Express
│
├── .env                      # Environment variables (git-ignored)
├── .gitignore                # Files/folders excluded from git
├── .prettierrc               # Prettier formatting rules
├── .prettierignore           # Paths excluded from Prettier
├── eslint.config.js          # ESLint flat config
├── combined.log              # Winston log output (git-ignored)
├── package.json              # Project metadata, scripts & dependencies
└── package-lock.json         # Locked dependency tree
```

---

## Architecture Overview

The project uses a **layered (MVC-inspired) architecture** with **Sequelize ORM** for database access. A request flows through each layer in a single direction, keeping responsibilities isolated:

```
   HTTP Request
        │
        ▼
┌───────────────┐   Defines endpoints and maps them to controllers.
│    Routes     │   Versioned under /v1 for future-proof API changes.
└───────┬───────┘
        ▼
┌───────────────┐   Parse/validate the request, invoke services,
│  Controllers  │   and shape the HTTP response.
└───────┬───────┘
        ▼
┌───────────────┐   Business logic — orchestrates operations,
│   Services    │   enforces rules (to be implemented).
└───────┬───────┘
        ▼
┌───────────────┐   Data access — talks to the database
│ Repositories  │   (to be implemented).
└───────────────┘
         ▼
┌───────────────┐
│  Database /   │   Database interaction via Sequelize models.
│  Models       │   Migrations and seeders managed by Sequelize CLI.
└───────────────┘
```

**Supporting layers:**

- **`config/`** — Centralizes environment configuration (`server-config.js`), the Winston logger (`logger-config.js`), and Sequelize database config (`config.json`). All config is re-exported through `config/index.js` for clean imports.
- **`middlewares/`** — Reusable Express middleware such as request validation, authentication, and error handling.
- **`models/`** — Sequelize model definitions. The `index.js` auto-loads all model files and sets up associations.
- **`migrations/`** — Database migration files for version-controlled schema changes.
- **`seeders/`** — Database seeder files for populating test or default data.

**Barrel exports:** Each folder has an `index.js` that re-exports its modules, so imports stay tidy — e.g. `const { ServerConfig, Logger } = require('./config');`.

---

## API Reference

Base URL: `http://localhost:<PORT>/api`

| Method | Endpoint      | Description                        |
| ------ | ------------- | ---------------------------------- |
| `GET`  | `/v1/info`    | Sample endpoint returning a status |

**Example response** (`GET /api/v1/info`):

```json
{
  "success": true,
  "message": "Hello World",
  "error": {},
  "data": {}
}
```

---

## Code Style & Linting

This project enforces consistent style with **ESLint** and **Prettier**:

- **Prettier** — single quotes, semicolons, 2-space indentation, 100-char line width, `es5` trailing commas.
- **ESLint** — extends the recommended JS ruleset with `eslint-config-prettier` to avoid conflicts with formatting.

Run before committing:

```bash
npm run lint:fix
npm run format
```

---

## Author

**Prathmesh Parab**

_Licensed under ISC._
