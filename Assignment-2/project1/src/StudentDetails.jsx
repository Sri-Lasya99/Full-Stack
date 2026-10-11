import React from 'react';
import { useParams } from 'react-router-dom';

const studentData = {
  '1': { name: 'Alice Johnson', major: 'Computer Science', year: '3rd Year' },
  '2': { name: 'Bob Smith', major: 'Electrical Engineering', year: '2nd Year' },
  '3': { name: 'Charlie Brown', major: 'Mechanical Engineering', year: '4th Year' }
};

export default function StudentDetails() {
  const { id } = useParams();
  const student = studentData[id];

  if (!student) {
    return (
      <div>
        <h3>Student Details</h3>
        <p>No student found with ID: {id}</p>
      </div>
    );
  }

  return (
    <div>
      <h3>Student Details (ID: {id})</h3>
      <p>Name: {student.name}</p>
      <p>Major: {student.major}</p>
      <p>Year: {student.year}</p>
    </div>
  );
}
