const express = require('express');
const mongoose = require('mongoose');
const Redis = require('ioredis');

const app = express();
app.use(express.json());

const PORT = 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student_db';
const VALKEY_URI = process.env.VALKEY_URI || 'redis://127.0.0.1:6379'; // Valkey uses the Redis protocol

// 1. Initialize Valkey/Redis client (using ioredis)
const valkey = new Redis(VALKEY_URI, {
  maxRetriesPerRequest: 1,
  retryStrategy(times) {
    if (times > 3) return null; // stop reconnecting after 3 attempts
    return Math.min(times * 100, 2000);
  }
});

valkey.on('connect', () => console.log('Connected to Valkey cache server'));
valkey.on('error', (err) => console.error('Valkey connection error:', err.message));

// 2. Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    seedInitialData();
  })
  .catch((err) => console.error('MongoDB connection error:', err.message));

// 3. Define Student Schema & Model
const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  course: { type: String, required: true },
  department: { type: String, required: true }
});

const Student = mongoose.model('Student', studentSchema);

// Helper function to auto-seed a sample student for instant testing
async function seedInitialData() {
  try {
    const count = await Student.countDocuments();
    if (count === 0) {
      await Student.create([
        { studentId: '1', name: 'Alice Smith', age: 20, course: 'Full Stack Web Development', department: 'CSE' },
        { studentId: '2', name: 'Bob Johnson', age: 22, course: 'Cloud Computing', department: 'IT' }
      ]);
      console.log('Sample student records seeded (IDs: "1", "2").');
    }
  } catch (err) {
    console.error('Error seeding data:', err.message);
  }
}

// 4. GET /students/:id with Valkey Caching
app.get('/students/:id', async (req, res) => {
  const { id } = req.params;
  const cacheKey = `student:${id}`;
  const startTime = process.hrtime();

  // Helper to calculate elapsed time in milliseconds
  const getElapsedMs = () => {
    const diff = process.hrtime(startTime);
    return ((diff[0] * 1e9 + diff[1]) / 1e6).toFixed(2);
  };

  try {
    // Step 1: Check Valkey cache first
    let cachedData = null;
    try {
      cachedData = await valkey.get(cacheKey);
    } catch (cacheErr) {
      console.warn('Cache read warning:', cacheErr.message);
    }

    if (cachedData) {
      const responseTime = getElapsedMs();
      console.log(`[Cache HIT] Student ID: ${id} | Response Time: ${responseTime} ms`);

      return res.status(200).json({
        status: 'Cache HIT',
        responseTime: `${responseTime} ms`,
        source: 'Valkey Cache',
        data: JSON.parse(cachedData)
      });
    }

    // Step 2: Cache Miss - Fetch record from MongoDB
    console.log(`[Cache MISS] Student ID: ${id} - Fetching from MongoDB...`);

    // Search by custom studentId or MongoDB _id
    let student = await Student.findOne({ studentId: id });
    if (!student && mongoose.Types.ObjectId.isValid(id)) {
      student = await Student.findById(id);
    }

    if (!student) {
      const responseTime = getElapsedMs();
      return res.status(404).json({
        message: 'Student not found',
        responseTime: `${responseTime} ms`
      });
    }

    // Step 3: Store record in Valkey cache with 60 seconds expiry (EX 60)
    try {
      await valkey.set(cacheKey, JSON.stringify(student), 'EX', 60);
    } catch (cacheErr) {
      console.warn('Cache write warning:', cacheErr.message);
    }

    const responseTime = getElapsedMs();
    console.log(`[Cache MISS] Student ID: ${id} | Fetched from MongoDB & Cached | Response Time: ${responseTime} ms`);

    return res.status(200).json({
      status: 'Cache MISS',
      responseTime: `${responseTime} ms`,
      source: 'MongoDB Database',
      data: student
    });

  } catch (error) {
    console.error('Server error:', error.message);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// 5. POST /students - Add a new student
app.post('/students', async (req, res) => {
  try {
    const { studentId, name, age, course, department } = req.body;
    const newStudent = await Student.create({ studentId, name, age, course, department });
    res.status(201).json({ message: 'Student created successfully', student: newStudent });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start the Express Server
app.listen(PORT, () => {
  console.log(`Express API running at http://localhost:${PORT}`);
  console.log(`Try: GET http://localhost:${PORT}/students/1`);
});
