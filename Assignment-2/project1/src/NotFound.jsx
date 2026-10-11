import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div>
      <h2>404 - Page Not Found</h2>
      <p>The requested page does not exist.</p>
      <Link to="/">Back to Home</Link>
    </div>
  );
}
