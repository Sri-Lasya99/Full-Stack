# Question 3: Node.js & Express Microservices Application with API Gateway & JWT

## Objective
Develop a Microservices application using Node.js and Express:
- **Student Service (Port 4001)**: Provides `GET /students`
- **Course Service (Port 4002)**: Provides `GET /courses`
- **API Gateway (Port 3000)**: Verifies the JWT sent by the client in the `Authorization` header (returns HTTP `401 Unauthorized` for missing/invalid token) and forwards requests to `/students` and `/courses` to the respective backend microservice.

---

## Architecture Diagram

```
                           ┌───────────────────────────────┐
                           │            Client             │
                           └───────────────┬───────────────┘
                                           │
                                           │ 1. Request with JWT
                                           │    Authorization: Bearer <token>
                                           ▼
                    ┌─────────────────────────────────────────────┐
                    │           API Gateway (Port 3000)           │
                    │  • Verifies JWT (returns 401 if invalid)    │
                    │  • Forwards authorized traffic              │
                    └──────────────┬────────────────┬─────────────┘
                                   │                │
            2. Forward /students   │                │   2. Forward /courses
                                   ▼                ▼
            ┌────────────────────────────┐    ┌───────────────────────────┐
            │ Student Service (Port 4001)│    │ Course Service (Port 4002)│
            │ GET /students              │    │ GET /courses              │
            └────────────────────────────┘    └───────────────────────────┘
```

---

## Two Advantages of Microservices over a Monolithic Application

1. **Independent Scalability**: In a monolith, the entire application must be duplicated to scale, wasting resources. In microservices, services with high traffic (such as the Student service) can be scaled independently without needing to scale lower-traffic services (such as the Course service).
2. **Fault Isolation (Resilience)**: In a monolithic architecture, a fatal crash, memory leak, or uncaught exception in any component can take down the entire system. In microservices, each service is isolated; if the Course service fails, the Student service and API Gateway remain operational.

---

## Running & Testing

1. **Install dependencies:**
   ```bash
   cd ques3
   npm install
   ```

2. **Start all 3 services:**
   ```bash
   npm start
   ```

3. **Step 1: Test without token (401 Unauthorized):**
   ```bash
   curl -i http://localhost:3000/students
   ```

4. **Step 2: Generate a test JWT:**
   ```bash
   curl http://localhost:3000/login
   ```

5. **Step 3: Access with the token:**
   ```bash
   curl http://localhost:3000/students -H "Authorization: Bearer <YOUR_TOKEN>"
   curl http://localhost:3000/courses -H "Authorization: Bearer <YOUR_TOKEN>"
   ```
