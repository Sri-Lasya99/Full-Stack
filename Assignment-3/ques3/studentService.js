const express = require('express');
const app = express();

const PORT = 4001;

app.use(express.json());

// In-memory student records
const students = [
  { id: 1, name: 'Alice Smith', major: 'Computer Science', semester: 4 },
  { id: 2, name: 'Bob Johnson', major: 'Data Science', semester: 6 },
  { id: 3, name: 'Charlie Davis', major: 'Information Technology', semester: 2 }
];

// GET /students - Returns list of students
app.get('/students', (req, res) => {
  console.log('[Student Service] Handled GET /students');
  res.status(200).json({
    service: 'Student Service',
    port: PORT,
    count: students.length,
    students
  });
});

app.listen(PORT, () => {
  console.log(`[Student Service] Running on http://localhost:${PORT}`);
});
