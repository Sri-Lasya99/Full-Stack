import React, { useState } from 'react';

export default function ChildComponent() {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    throw new Error('This error was triggered by clicking the button!');
  }

  return (
    <div>
      <h3>Child Component</h3>
      <p>Click the button below to simulate an error in this component:</p>
      <button onClick={() => setHasError(true)}>Trigger Error</button>
    </div>
  );
}
