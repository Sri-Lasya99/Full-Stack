import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import About from './About';
import Students from './Students';
import StudentDetails from './StudentDetails';
import NotFound from './NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <div>
        <h1>Single Page Application</h1>
        <nav>
          <Link to="/">Home</Link> |{' '}
          <Link to="/about">About</Link> |{' '}
          <Link to="/students">Students</Link>
        </nav>
        <hr />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/students" element={<Students />}>
            <Route path=":id" element={<StudentDetails />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
