import React, { useState } from 'react';
import ErrorBoundary from './ErrorBoundary';
import ChildComponent from './ChildComponent';

export default function App() {
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey((prevKey) => prevKey + 1);
  };

  return (
    <div>
      <h1>Error Boundary Demonstration</h1>
      <ErrorBoundary key={resetKey} onReset={handleReset}>
        <ChildComponent />
      </ErrorBoundary>
    </div>
  );
}
