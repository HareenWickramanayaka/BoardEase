import React from 'react';
import { Navigate } from 'react-router-dom';

function Protected({ user, role, children }) {
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    return (
      <Navigate
        to={user.role === 'owner' ? '/dashboard' : '/explore'}
        replace
      />
    );
  }
  return children;
}

export default Protected;
