# MultiMartConnect

A multi-tenant e-commerce platform written in TypeScript. An Express 5 API resolves the tenant on every request, authenticates users with JWT and role checks, places orders inside MongoDB transactions, publishes order events to Kafka and pushes real-time alerts to sellers over Socket.IO. A Next.js 15 frontend provides the storefront, merchant dashboard and admin views.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)
![Express 5](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![Next.js 15](https://img.shields.io/badge/Next.js-15-000000?logo=nextdotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white)
![Apache Kafka](https://img.shields.io/badge/Kafka-KafkaJS-231F20?logo=apachekafka&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?logo=socketdotio&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)

## Features

- **Tenant resolution middleware**: every tenant-scoped request carries an `x-tenant-id` (MongoDB ObjectId) or `x-tenant-slug` header. The tenant is looked up once, cached for 30 minutes, and suspended tenants are rejected with `403`.
- **JWT authentication and role-based access**: Bearer tokens are verified with `JWT_ACCESS_SECRET`, and a token issued for one tenant cannot be used against another. Routes can be restricted to `SUPER_ADMIN`, `SELLER` or `CUSTOMER`.
- **Layered orders module**: routes, controller, service, repository, DTOs, Mongoose models and a Zod validator, with request validation as middleware.
- **Transactional order placement**: prices are re-read from the tenant's catalog (client prices are ignored), and stock is checked and decremented in a MongoDB session transaction together with the order insert.
- **Event streaming**: each new order is published to the `order-created` Kafka topic through KafkaJS. If no broker is reachable, the producer falls back to logging the event so local development keeps working.
- **Real-time notifications**: Socket.IO connections are authenticated with the same JWT and joined to tenant, user and tenant-role rooms. Sellers of the tenant receive a `NEW_ORDER_ALERT` when an order is placed.
- **Redis cart persistence**: `/api/cart` stores a user's cart in Redis with a 7-day TTL so it survives page reloads.
- **Seed script**: creates demo tenants (one suspended), users for each role and tenant-scoped products.
- **Next.js 15 frontend**: App Router pages for the landing page, storefront, login/registration, a merchant dashboard and an admin view, styled with Tailwind CSS. It also includes an axios client that injects the tenant header and Bearer token, a React Query hook, a Zustand auth store and a Socket.IO hook.

## Architecture

### Request flow (orders)

```
Client
  │  POST /api/v1/orders   (x-tenant-id | x-tenant-slug, Authorization: Bearer <jwt>)
  ▼
helmet → CORS (ALLOWED_ORIGINS) → JSON body parser
  ▼
tenantInterceptor     resolve tenant (cache → MongoDB), reject unknown/suspended tenants
  ▼
authenticatingPipeline verify JWT, enforce token tenant == request tenant
  ▼
authorizeRoles('CUSTOMER')
  ▼
validatePayload(CreateOrderSchema)   Zod
  ▼
OrderController → OrderService → OrderRepository
                                   └─ MongoDB transaction: check + decrement inventory, insert order
  ▼
OrderService (after commit)
  ├─ invalidate cached product entries
  ├─ KafkaProducerService.emit('order-created', orderId, order)
  └─ SocketEngine.emitToRole(tenantId, 'SELLER', 'NEW_ORDER_ALERT', …)
```

### Events and real-time push

Order events are produced to Kafka (`order-created`). The Socket.IO push to sellers is currently sent directly from `OrderService` after the event is emitted. A reusable `KafkaConsumerService` (consumer group subscription with JSON payload parsing) exists in `backend/src/services/consumer.service.ts` but is not yet started by the server. The intended flow is order event → Kafka → consumer → Socket.IO push.

### Caching and storage

- **MongoDB** (via Mongoose) stores tenants, products, inventory, customers and orders.
- **Redis** backs the cart endpoints (`cart:<userId>` keys, 7-day expiry) through a client created in `app.ts`.
- **Tenant metadata cache**: `CacheService` exposes a Redis-style API (`get`/`set` with TTL, `del`, pattern invalidation), but it currently stores entries in process memory. `RedisConfig` is a stub, so tenant metadata is not yet shared across instances.

## Project structure

```
.
├── package.json                  # backend dependencies and scripts (dev:api, seed)
└── MultiMartConnect/
    ├── backend/
    │   ├── .env.example
    │   ├── tsconfig.json
    │   └── src/
    │       ├── app.ts            # Express app, middleware, cart routes, 404 handler
    │       ├── server.ts         # boot: MongoDB, Kafka producer, Socket.IO, listen on :8000
    │       ├── config/           # db, kafka, redis, env (required variables)
    │       ├── middlewares/      # tenant, auth (JWT), role, validation (Zod)
    │       ├── modules/
    │       │   └── orders/       # routes, controllers, services, repositories, dtos, models, validators
    │       ├── services/         # cache, Kafka producer/consumer, Socket.IO engine
    │       ├── scripts/seed.ts   # demo data
    │       └── types/            # Express Request augmentation
    └── frontend/
        ├── .env.example
        ├── package.json
        └── src/
            ├── app/              # /, /store, /login, /register, /dashboard, /admin
            ├── hooks/            # useSocket, useTenantQuery
            ├── services/         # axios API client
            └── store/            # Zustand auth store
```

## Getting started

### Prerequisites

- Node.js 18.18 or later and npm
- MongoDB running as a replica set (order creation uses multi-document transactions)
- Redis on `localhost:6379` (used by the cart endpoints)
- Apache Kafka (optional for local development: without a broker, order events are only logged)

### Environment variables

The backend does not load `.env` files on its own, so export these variables in your shell or process manager. The frontend reads `MultiMartConnect/frontend/.env.local`. Both `.env.example` files list them with placeholder values.

| Variable | App | Required | Description |
| --- | --- | --- | --- |
| `JWT_ACCESS_SECRET` | backend | yes | Secret used to verify access tokens for HTTP and Socket.IO. The server does not start without it. |
| `MONGO_URI` | backend | no | MongoDB connection string (default `mongodb://localhost:27017/multimart_db`). |
| `ALLOWED_ORIGINS` | backend | no | Comma-separated CORS / Socket.IO origins (default `http://localhost:3000`). |
| `KAFKA_BROKERS` | backend | no | Comma-separated Kafka brokers (default `localhost:9092`). |
| `NODE_ENV` | backend | no | `production` enables SSL for the Kafka client. |
| `NEXT_PUBLIC_API_GATEWAY_URL` | frontend | no | REST API base URL (default `http://localhost:8000/api/v1`). |
| `NEXT_PUBLIC_WS_GATEWAY_URL` | frontend | no | Socket.IO server URL (default `http://localhost:8000`). |

### Run

```bash
# Backend (from the repository root)
npm install
export JWT_ACCESS_SECRET=<your-secret>
export MONGO_URI=<your-mongodb-uri>
npm run seed        # optional: load demo tenants, users and products
npm run dev:api     # http://localhost:8000  (health check: GET /health)

# Frontend
cd MultiMartConnect/frontend
npm install
cp .env.example .env.local
npm run dev         # http://localhost:3000
```

Note: the seed script and the server use different default database names (`multimart-connect` and `multimart_db`). Set `MONGO_URI` explicitly so both use the same database.

## Roadmap and known limitations

This is a work in progress. Current gaps:

- **Infrastructure setup**: there is no `docker-compose` file yet for MongoDB (replica set), Redis and Kafka.
- **Tests and CI**: there are no automated tests or CI workflow.
- **Type check**: `tsc --noEmit` on the backend still reports errors. The order DTO and the Express type augmentation import `@prisma/client` (a leftover from an earlier Prisma version), the validation middleware uses the Zod 3 `error.errors` API with Zod 4, and the seed script and consumer service have strict-mode errors. The server runs with `--transpile-only`.
- **Order validation**: `CreateOrderSchema` requires `productId` to be a UUID, but products use MongoDB ObjectIds.
- **Authentication endpoints**: there are no login, registration or `/auth/refresh` endpoints on the backend yet. The frontend login stores a demo session in `localStorage`, and most dashboard and storefront data is mocked on the client.
- **Cart endpoints**: they are not authenticated or tenant-scoped, and the storefront calls them at a hard-coded `http://localhost:8000`.
- **Configuration**: the HTTP port (8000) and the Redis URL are hard-coded. `PORT`/`REDIS_URL` support is planned.
- **Caching and events**: replace the in-memory `CacheService` with Redis, and wire `KafkaConsumerService` to drive the Socket.IO notifications.
- **Repository layout**: the backend dependencies live in the root `package.json`, separate from the frontend's own `package.json`. Moving to npm workspaces would make this cleaner.

---

Author: Muhammad Usman — [LinkedIn](https://www.linkedin.com/in/muhammad-usman-the-dev) · [Portfolio](https://portfolio-usman-46c4.vercel.app)
