# Express WhatsApp Baileys API

Express WhatsApp Baileys is a RESTful WhatsApp API built with Node.js, Express, and Baileys, featuring authentication, validation, and multi-user WhatsApp session management.

## Features

- Multi-session WhatsApp (Baileys)
- JWT Authentication
- Request validation (Joi)
- User & role management
- Database migration & seeder (Sequelize)
- Minio support
- WhatsApp QR Code login
- Send WhatsApp messages via REST API

## Folder Structure

```
src/
  app.ts                // Application entry point
  config/               // Database, redis, storage configuration
  controllers/          // Endpoint controllers
  middleware/           // Authentication, validation, upload middleware
  migrations/           // Database migration files
  models/               // Sequelize models
  routes/               // Express routing
  seeders/              // Database seeders
  services/             // Business logic
  types/                // TypeScript types & constants
  utils/                // Helpers & utilities
  validation/           // Request validation
  workers/              // WhatsApp workers
```

## Installation

1. Clone this repository
2. Install dependencies:
    ```bash
    npm install
    ```
3. Copy `.env.example` to `.env` and adjust configuration as needed
4. Run database migrations:
    ```bash
    npm run db:migrate
    npm run db:seed
    ```
5. Start the application:
    ```bash
    npm run dev
    ```

## Main Endpoints

- `POST /api/auth/register` — User register
- `POST /api/auth/login` — User login
- `POST /api/whatsapp/start` — Start WhatsApp session
- `POST /api/whatsapp/stop` — Stop and Logout WhatsApp session
- `GET /api/whatsapp/qrcode` — Get WhatsApp QR Code
- `GET /api/whatsapp/token` — Get WhatsApp Key Token
- `POST /api/whatsapp/send` — Send WhatsApp message

## Technology Stack

- Node.js, Express
- TypeScript
- Baileys
- Sequelize (PostgreSQL)

## Contribution

Pull requests & issues are welcome!

## License

MIT
