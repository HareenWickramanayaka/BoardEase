import React from 'react';
import Card from './Card.jsx';

function Cards({ items, favorites, toggleFavorite, user }) {
  return (
    <div className="property-grid">
      {items.map((item) => (
        <Card
          key={item._id}
          item={item}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          user={user}
        />
      ))}
    </div>
  );
}

export default Cards;
