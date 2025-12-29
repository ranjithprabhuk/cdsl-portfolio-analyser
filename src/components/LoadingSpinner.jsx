import React from 'react';

function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="spinner-overlay">
      <div className="text-center">
        <div className="spinner-border text-light" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-light mt-3">{message}</p>
      </div>
    </div>
  );
}

export default LoadingSpinner;
