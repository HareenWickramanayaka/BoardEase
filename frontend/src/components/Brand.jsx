import React from 'react';
import { Link } from 'react-router-dom';
import { Home as HomeIcon } from 'lucide-react';

function Brand() {
  return (
    <Link to="/" className="brand">
      <span className="brand-mark">
        <HomeIcon size={22} strokeWidth={2.6} />
      </span>
      <span>
        board<span className="brand-accent">ease</span>
      </span>
    </Link>
  );
}

export default Brand;
