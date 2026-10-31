import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  MapPin,
  BedDouble,
  Bath,
  Users,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { FALLBACK_IMAGE } from '../data/constants.js';
import { currency } from '../utils/formatters.js';

function Card({ item, favorites, toggleFavorite, user }) {
  const liked = favorites.includes(item._id);
  return (
    <article className="property-card">
      <Link to={`/boarding/${item._id}`} className="property-image">
        <img
          loading="lazy"
          src={item.image}
          alt={item.title}
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
        />
        {item.featured && (
          <span className="property-tag">
            <Sparkles size={13} /> Featured
          </span>
        )}
      </Link>
      <button
        className={`heart-button ${liked ? 'liked' : ''}`}
        onClick={() => toggleFavorite(item._id)}
        title={liked ? 'Remove from saved' : 'Save boarding'}
        aria-label={liked ? 'Remove from saved' : 'Save boarding'}
      >
        <Heart size={19} fill={liked ? 'currentColor' : 'none'} />
      </button>
      <div className="property-body">
        <div className="property-location">
          <MapPin size={14} />
          {item.location}, {item.city}
        </div>
        <Link to={`/boarding/${item._id}`}>
          <h3>{item.title}</h3>
        </Link>
        <div className="property-info">
          <span>
            <BedDouble size={15} />
            {item.beds} bed{item.beds > 1 ? 's' : ''}
          </span>
          <span>
            <Bath size={15} />
            {item.baths} bath
          </span>
          <span>
            <Users size={15} />
            {item.gender === 'Any' ? 'Everyone' : item.gender}
          </span>
        </div>
        <div className="property-bottom">
          <div>
            <strong>{currency(item.price)}</strong>
            <small> / month</small>
          </div>
          <Link
            to={`/boarding/${item._id}`}
            className="circle-arrow"
            aria-label={`View ${item.title}`}
          >
            <ArrowUpRight size={19} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default Card;
