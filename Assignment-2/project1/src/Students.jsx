import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const studentsList = [
  { id: '1', name: 'sri' },
  { id: '2', name: 'lasya' },
  { id: '3', name: 'sree' }
];

export default function Students() {
  return (
    <div>
      <h2>Students List</h2>
      <ul>
        {studentsList.map((student) => (
          <li key={student.id}>
            <Link to={`/students/${student.id}`}>{student.name}</Link>
          </li>
        ))}
      </ul>
      <hr />
      {/* Nested route component will be rendered here */}
      <Outlet />
    </div>
  );
}
