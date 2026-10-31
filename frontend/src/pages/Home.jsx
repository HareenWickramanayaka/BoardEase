import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Search,
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Heart,
  MessageCircle,
  KeyRound,
} from 'lucide-react';
import Pill from '../components/Pill.jsx';
import Cards from '../components/Cards.jsx';
import api from '../services/api.js';

function Home({ favorites, toggleFavorite }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    api('/boardings')
      .then(setProperties)
      .catch(() => {});
  }, []);

  return (
    <>
      <section className="hero page-width">
        <div className="hero-content">
          <Pill light>THE SMART WAY TO FIND YOUR SPACE</Pill>
          <h1>
            Find a place
            <br />
            that feels <em>like home</em>
          </h1>
          <p>
            Less searching, more settling in. Discover comfortable, affordable
            boarding spaces made for student life
          </p>
          <form
            className="hero-search"
            onSubmit={(e) => {
              e.preventDefault();
              navigate(
                '/explore' +
                  (search.trim()
                    ? `?search=${encodeURIComponent(search.trim())}`
                    : '')
              );
            }}
          >
            <MapPin size={21} />
            <input
              placeholder="Where are you looking? e.g. Matara"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit">
              <Search size={18} /> Find a space
            </button>
          </form>
          <div className="hero-popular">
            <span>Popular:</span>
            {['Matara', 'Galle', 'Colombo'].map((x) => (
              <Link key={x} to={`/explore?search=${x}`}>
                {x} <ArrowUpRight size={12} />
              </Link>
            ))}
          </div>
        </div>
        <div className="hero-visual">
          <img
            src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=85"
            alt="Bright and welcoming home interior"
          />
          <div className="hero-image-shade" />
          <div className="hero-floating">
            <div className="float-icon">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <strong>Your next chapter starts here.</strong>
              <span>Spaces worth coming home to</span>
            </div>
          </div>
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
        </div>
      </section>
      <section className="trust-bar">
        <div className="page-width trust-inner">
          <span>
            <ShieldCheck size={19} /> Easy-to-browse listings
          </span>
          <span>
            <Search size={19} /> Smarter search filters
          </span>
          <span>
            <Heart size={19} /> Save spaces you love
          </span>
          <span>
            <MessageCircle size={19} /> Connect directly with owners
          </span>
        </div>
      </section>
      <section className="section page-width">
        <div className="section-header">
          <div>
            <Pill>HANDPICKED FOR YOU</Pill>
            <h2>
              Spaces you'll <em>love living in</em>
            </h2>
            <p>Explore places with the comfort and convenience you deserve</p>
          </div>
          <Link className="text-link" to="/explore">
            Explore all spaces <ArrowUpRight size={18} />
          </Link>
        </div>
        {properties.length ? (
          <Cards
            items={properties.slice(0, 6)}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
        ) : (
          <div className="home-loading">
            <p>
              Start the server and load sample data to see available boardings
            </p>
            <Link className="text-link" to="/explore">
              Browse listings <ArrowRight size={17} />
            </Link>
          </div>
        )}
      </section>
      <section className="how-section">
        <div className="page-width">
          <div className="center-header">
            <Pill>YOUR JOURNEY, SIMPLIFIED</Pill>
            <h2>
              From searching to <em>settling in</em>
            </h2>
            <p>Finding your next place doesn't have to be complicated</p>
          </div>
          <div className="steps-grid">
            <div className="step">
              <div className="step-icon">
                <Search size={28} />
                <span>01</span>
              </div>
              <h3>Explore spaces</h3>
              <p>Search by location, budget, room type and your preferences</p>
            </div>
            <div className="step">
              <div className="step-icon">
                <Heart size={28} />
                <span>02</span>
              </div>
              <h3>Save your favourites</h3>
              <p>Keep the places you like in one easy-to-access shortlist</p>
            </div>
            <div className="step">
              <div className="step-icon">
                <KeyRound size={28} />
                <span>03</span>
              </div>
              <h3>Connect & move in</h3>
              <p>Check the details and contact the boarding owner directly</p>
            </div>
          </div>
        </div>
      </section>
      <section className="owner-cta page-width">
        <div className="owner-cta-copy">
          <Pill light>FOR BOARDING OWNERS</Pill>
          <h2>
            Your space deserves
            <br />
            to be <em>discovered</em>
          </h2>
          <p>
            Have a boarding place to rent? Reach students looking for a home
            away from home. List and manage your property in a few easy steps
          </p>
          <Link to="/register" className="btn btn-cream">
            List your property <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="owner-cta-image">
          <img
            src="https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1000&q=85"
            alt="Cozy boarding interior"
          />
        </div>
      </section>
    </>
  );
}

export default Home;
