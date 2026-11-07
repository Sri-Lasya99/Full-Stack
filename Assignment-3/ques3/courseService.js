const express = require('express');
const app = express();

const PORT = 4002;

app.use(express.json());

// In-memory course records
const courses = [
  { courseId: 'CS101', title: 'Full Stack Web Development', credits: 4, instructor: 'Dr. Miller' },
  { courseId: 'CS102', title: 'Cloud & Distributed Systems', credits: 3, instructor: 'Prof. Garcia' },
  { courseId: 'CS103', title: 'Database Management Systems', credits: 3, instructor: 'Dr. Lee' }
];

// GET /courses - Returns list of courses
app.get('/courses', (req, res) => {
  console.log('[Course Service] Handled GET /courses');
  res.status(200).json({
    service: 'Course Service',
    port: PORT,
    count: courses.length,
    courses
  });
});

app.listen(PORT, () => {
  console.log(`[Course Service] Running on http://localhost:${PORT}`);
});
