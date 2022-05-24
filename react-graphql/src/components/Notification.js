import React from 'react';
import './Notification.css';

export default function Notification({ message, error }) {
  if (!message) return null;

  return (
    <div className={`Notification ${(error) ? 'Error' : 'Success'}`}>
      {message}
    </div>
  );
}
