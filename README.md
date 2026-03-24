
# 🚏 Webhook-Driven Task Processing Pipeline

A **TypeScript-based event-driven backend system** that receives webhooks, processes them asynchronously using a job queue, and delivers results to subscribers.

This project simulates a **real delivery monitoring system**, including delay detection, driver performance monitoring, feedback processing, and alert generation.

---

## 🚀 Features

* Non-blocking **webhook ingestion**
* Background **job queue + worker processing**
* **Pipeline system** (custom webhook URLs per workflow)
* **Job chaining** between actions
* Built-in **retry & failure handling**
* **Subscriber system** for delivering results
* Real-time **Delivery Monitor dashboard**
* PostgreSQL + Drizzle ORM
* Docker & CI ready

---

## 🏗 Architecture

### Core Flow

```
Webhook → Pipeline → Job → Worker → Action → (Optional Chain) → Subscribers
```

### System Components

| Component   | Description                                                |
| ----------- | ---------------------------------------------------------- |
| Pipelines   | Define webhook source (`/webhooks/:sourcePath`) and action |
| Webhooks    | Accept requests, create jobs, return immediately           |
| Worker      | Processes jobs asynchronously with retries                 |
| Actions     | Pure business logic (delivery, feedback, alerts, etc.)     |
| Subscribers | Receive processed results (alerts, frontend, logs)         |

---

## ⚙️ Actions Implemented

| Action                     | Description                      |
| -------------------------- | -------------------------------- |
| `updateDeliveryStatus`     | Updates delivery state           |
| `detectDelay`              | Detects late deliveries          |
| `delayAlertChain`          | Creates delay alerts             |
| `feedbackIntegration`      | Stores ratings & feedback        |
| `driverPerformanceMetrics` | Calculates driver ratings        |
| `driverDelaySpikeChain`    | Escalates low-performing drivers |

---

## 📡 API Overview

### Pipelines

```http
POST /pipelines
GET /pipelines
```

---

### Webhooks (Entry Point)

```http
POST /webhooks/:sourcePath
```

Examples:

```
/webhooks/deliveries-main
/webhooks/delay-main
/webhooks/feedback-main
```

---

### Data Endpoints

```http
GET /deliveries
GET /drivers
GET /alerts
GET /jobs
GET /analytics
GET /feedback
```
### AND MANY OTHER ENDPOINTS

---

## 🖥 Delivery Monitor (Frontend)

A lightweight dashboard built with:

* HTML
* Tailwind CSS
* Vanilla JavaScript

### Displays

* Delivery volume over time
* Active jobs by action
* Alerts & logs
* Driver ratings & status
* Deliveries table

### 🎥 Demonstration
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/1ed188c0-16e3-4a81-99aa-e349fc6b2dfc" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/4c9440c7-7c21-4d99-a2b6-6a188115d88a" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/4f819739-a9fb-48cc-a82a-c39c2e14cc39" />

---

## 🛠 Installation & Running

### 1. Install dependencies

```bash
npm install
```


### 2. Setup environment

Create `.env`:

```env
DATABASE_URL=postgres://user:password@localhost:5432/db
PORT=3000
```


### 3. Run database migrations

```bash
npm run db:generate
npm run db:migrate
```


### 4. Start backend & 🐳 Docker

```bash
docker compose up --build
```


### 5. Run frontend dashboard

```bash
npx serve dashboard -l <PORT_OTHER_THAN_USED_ONES> dashboard
```



---

## 🧪 Testing

```bash
npm test
```

---

## 📊 What Makes This Project Stand Out

* Real **event-driven architecture**
* Full **job lifecycle management**
* **Chained workflows** and not just isolated actions
* Strong **error handling & retry logic**
* Includes a **live dashboard (Delivery Monitor)**
* Simulates real-world logistics & delivery systems



