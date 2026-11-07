const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'secret_microservices_key_123';

const STUDENT_SERVICE_URL = process.env.STUDENT_SERVICE_URL || 'http://localhost:4001';
const COURSE_SERVICE_URL = process.env.COURSE_SERVICE_URL || 'http://localhost:4002';

app.use(express.json());

// 1. Helper endpoint to generate a test JWT
app.post('/login', (req, res) => {
  const { username = 'demo_user', role = 'student' } = req.body || {};
  // Create signed JWT valid for 1 hour
  const token = jwt.sign({ username, role }, JWT_SECRET, { expiresIn: '1h' });
  return res.status(200).json({
    message: 'Login successful. Use this token in the Authorization header as: Bearer <token>',
    token
  });
});

// Also support GET /login for convenience in browsers
app.get('/login', (req, res) => {
  const token = jwt.sign({ username: 'demo_user', role: 'student' }, JWT_SECRET, { expiresIn: '1h' });
  return res.status(200).json({
    message: 'Login successful. Use this token in the Authorization header as: Bearer <token>',
    token
  });
});

// 2. JWT Verification Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Access denied. No authorization token was provided.'
    });
  }

  // Extract token: accepts "Bearer <token>" or raw token
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

  jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
    if (err) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token.'
      });
    }

    req.user = decodedUser;
    next();
  });
}

// 3. Forward GET /students to Student Service (port 4001)
app.get('/students', authenticateToken, async (req, res) => {
  console.log(`[API Gateway] Verified JWT for user "${req.user.username}". Forwarding GET /students to ${STUDENT_SERVICE_URL}...`);
  try {
    const response = await axios.get(`${STUDENT_SERVICE_URL}/students`);
    res.status(response.status).json({
      gateway: 'API Gateway (Port 3000)',
      authenticatedUser: req.user,
      ...response.data
    });
  } catch (err) {
    console.error('[API Gateway] Failed forwarding to Student Service:', err.message);
    res.status(502).json({
      error: 'Bad Gateway',
      message: 'Student Service is unavailable. Ensure it is running on port 4001.'
    });
  }
});

// 4. Forward GET /courses to Course Service (port 4002)
app.get('/courses', authenticateToken, async (req, res) => {
  console.log(`[API Gateway] Verified JWT for user "${req.user.username}". Forwarding GET /courses to ${COURSE_SERVICE_URL}...`);
  try {
    const response = await axios.get(`${COURSE_SERVICE_URL}/courses`);
    res.status(response.status).json({
      gateway: 'API Gateway (Port 3000)',
      authenticatedUser: req.user,
      ...response.data
    });
  } catch (err) {
    console.error('[API Gateway] Failed forwarding to Course Service:', err.message);
    res.status(502).json({
      error: 'Bad Gateway',
      message: 'Course Service is unavailable. Ensure it is running on port 4002.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`[API Gateway] Running on http://localhost:${PORT}`);
  console.log(`- POST or GET http://localhost:${PORT}/login to generate a JWT`);
  console.log(`- GET http://localhost:${PORT}/students (requires JWT)`);
  console.log(`- GET http://localhost:${PORT}/courses (requires JWT)`);
});
