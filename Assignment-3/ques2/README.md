# Question 2: Express API with Valkey Caching & MongoDB

## Objective
Speed up an Express API using Valkey (or Redis) caching:
- For `GET /students/:id`, check the Valkey cache first using `ioredis`.
- On a **Cache MISS**: Fetch the record from MongoDB, store it in Valkey with a 60-second expiry (`EX 60`), and return the record.
- On a **Cache HIT**: Return the record directly from Valkey.
- Log `'Cache HIT'` / `'Cache MISS'` and display the difference in response times.

---

## Architecture Flow

```
Client (Browser/cURL/Postman)
        │
        ▼
Express Server (`GET /students/:id`)
        │
        ├─── 1. Check Valkey Cache (`student:<id>`)
        │       ├── [HIT]  ──> Return data immediately (~1-2 ms)
        │       │
        │       └── [MISS] ──> 2. Query MongoDB (~25-50 ms)
        │                       │
        │                       ├── 3. Save to Valkey (`EX 60` seconds)
        │                       └── 4. Return data to client
```

---

## Setup & Running

1. **Install dependencies:**
   ```bash
   cd ques2
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **Test Requests:**
   - **First Call (Cache MISS):**
     ```bash
     curl http://localhost:3000/students/1
     ```
   - **Second Call within 60s (Cache HIT):**
     ```bash
     curl http://localhost:3000/students/1
     ```

---

## Response Time Comparison

| Request Type | Source | Typical Response Time | Improvement |
|--------------|--------|-----------------------|-------------|
| 1st Request (Cache MISS) | MongoDB Database | ~25 - 45 ms | Baseline |
| 2nd Request (Cache HIT)  | Valkey In-Memory Cache| ~1 - 2 ms | **~20x - 30x faster!** |
