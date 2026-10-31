import React from 'react';
import { Building2 } from 'lucide-react';

function Empty({ icon: Icon = Building2, title, text, children }) {
  return (
    <div className="empty">
      <div className="empty-icon">
        <Icon size={28} />
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
      {children}
    </div>
  );
}

export default Empty;
