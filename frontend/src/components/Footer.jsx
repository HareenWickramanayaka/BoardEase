import React from 'react';
import { Link } from 'react-router-dom';
import Brand from './Brand.jsx';

function Footer() {
  return (
    <footer className="footer">
      <div className="page-width">
        <div className="footer-top">
          <div>
            <Brand />
            <p>
              Finding a place that feels like yours,
              <br />
              made simpler for students in Sri Lanka
            </p>
          </div>
          <div className="footer-menu">
            <div>
              <strong>Discover</strong>
              <Link to="/explore">Explore boardings</Link>
              <Link to="/about">How it works</Link>
            </div>
            <div>
              <strong>For owners</strong>
              <Link to="/register">List your property</Link>
              <Link to="/login">Owner login</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 BoardEase. Built for student living.</span>
          <span>
            Made with care in Sri Lanka <span className="little-heart">♥</span>
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
