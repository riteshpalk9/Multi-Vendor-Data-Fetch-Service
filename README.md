# 💡 Multi-Vendor Data Fetch Service

A backend system providing a **clean internal API** that abstracts the differences between multiple external data vendors (sync and async). Built using **Node.js**, **MongoDB**, **RabbitMQ**, and **Docker Compose**.

---

## 🚀 Quick Start Commands

```bash
# Clone this repository
git clone https://github.com/your-username/multi-vendor-data-fetch-service.git
cd multi-vendor-data-fetch-service

# Run the project with Docker Compose
docker compose up --build

# To stop all services
Ctrl + C
docker compose down
```

📍 Services:
- API: `http://localhost:3000`
- Webhook (Async Receiver): `http://localhost:5050`
- RabbitMQ UI: `http://localhost:15672` (`guest` / `guest`)
- MongoDB: `mongodb://localhost:27017`

---

## 🗺️ Architecture Diagram (ASCII)

```txt
                            ┌─────────────┐
                            │  Frontend   │
                            └─────┬───────┘
                                  │
                        POST /jobs │  GET /jobs/:id
                                  ▼
                           ┌───────────┐
                           │   API     │
                           └────┬──────┘
                                │ Queue
                                ▼
                           ┌───────────┐
                           │  Worker   │
                           └────┬──────┘
                      ┌────────┴────────┐
                      ▼                 ▼
             ┌─────────────┐     ┌─────────────┐
             │ Vendor Sync │     │ Vendor Async│
             └─────────────┘     └──────┬──────┘
                                        │
                                 HTTP POST (5s delay)
                                        ▼
                               ┌────────────────┐
                               │  Webhook (5050)│
                               └────────────────┘

               📦 All results saved to MongoDB
```

---

## ⚙️ Key Design Decisions & Trade-offs

```txt
- Used RabbitMQ for job queueing:
  ✓ Supports delayed/async vendor behavior
  ✓ Easily integrates with Node.js

- Used MongoDB for persistence:
  ✓ Stores job status and results
  ✓ Fast read/write for async polling via GET /jobs/:id

- Mock Vendors:
  ✓ Sync Vendor: replies immediately
  ✓ Async Vendor: replies via webhook after 5s

- Trade-off:
  ✗ `setTimeout()` used for async vendor delay is not scalable for production
  ✓ But works well for simulating real-world async APIs in a test setup

- Docker Compose used to:
  ✓ Spin up all services with 1 command
  ✓ Guarantee a consistent dev/test environment
```

---
