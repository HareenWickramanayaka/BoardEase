import React from 'react';

function Pill({ children, light = false }) {
  return (
    <span className={`eyebrow ${light ? 'eyebrow-light' : ''}`}>
      <span className="eyebrow-dot" />
      {children}
    </span>
  );
}

export default Pill;
