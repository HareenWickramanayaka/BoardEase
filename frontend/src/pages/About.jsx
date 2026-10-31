import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Compass, Bookmark, MessageCircle } from 'lucide-react';
import Pill from '../components/Pill.jsx';

function About() {
  return (
    <main className="page-width inner-page about-page">
      <div className="inner-heading center-header">
        <Pill>WHY BOARDEASE</Pill>
        <h1>
          Good places <em>Better beginnings</em>
        </h1>
        <p>
          We make it easier for students to discover boarding spaces and for
          property owners to reach the people looking for them
        </p>
      </div>
      <div className="about-grid">
        <div className="about-picture">
          <img
            src="https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1000&q=85"
            alt="Comfortable home interior"
          />
        </div>
        <div className="about-copy">
          <Pill>SIMPLER STUDENT LIVING</Pill>
          <h2>A home away from home is closer than you think</h2>
          <p>
            BoardEase brings the important information into one place: clear
            rent prices, room preferences, amenities, availability and direct
            owner contact
          </p>
          <p>
            For boarding owners, our simple dashboard makes managing property
            listings straightforward
          </p>
          <Link to="/explore" className="btn btn-dark">
            Explore spaces <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
      <div className="steps-grid about-steps">
        <div className="step">
          <div className="step-icon">
            <Compass size={28} />
          </div>
          <h3>Discover</h3>
          <p>Explore properties based on the things that matter to you</p>
        </div>
        <div className="step">
          <div className="step-icon">
            <Bookmark size={28} />
          </div>
          <h3>Shortlist</h3>
          <p>Save the listings you want to come back to</p>
        </div>
        <div className="step">
          <div className="step-icon">
            <MessageCircle size={28} />
          </div>
          <h3>Connect</h3>
          <p>Contact the owner directly to discuss the next steps</p>
        </div>
      </div>
    </main>
  );
}

export default About;
