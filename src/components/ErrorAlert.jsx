import React from 'react';

function ErrorAlert({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="alert alert-danger alert-dismissible fade show" role="alert">
      <strong>Error!</strong> {message}
      <button
        type="button"
        className="btn-close"
        onClick={onClose}
        aria-label="Close"
      ></button>
    </div>
  );
}

export default ErrorAlert;
