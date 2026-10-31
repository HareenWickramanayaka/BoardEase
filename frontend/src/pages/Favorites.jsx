import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import Pill from '../components/Pill.jsx';
import Loading from '../components/Loading.jsx';
import Empty from '../components/Empty.jsx';
import Cards from '../components/Cards.jsx';
import api from '../services/api.js';

function Favorites({ favorites, toggleFavorite }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/boardings')
      .then((data) => setList(data.filter((x) => favorites.includes(x._id))))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [favorites]);

  return (
    <main className="page-width inner-page">
      <div className="inner-heading">
        <Pill>YOUR SHORTLIST</Pill>
        <h1>
          Spaces you've <em>saved</em>
        </h1>
        <p>Good places are worth keeping close</p>
      </div>
      {loading ? (
        <Loading />
      ) : list.length ? (
        <Cards
          items={list}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
        />
      ) : (
        <Empty
          icon={Heart}
          title="No saved homes yet"
          text="Tap the heart on any listing to save it here for later."
        >
          <Link className="btn btn-dark" to="/explore">
            Explore spaces <ArrowRight size={16} />
          </Link>
        </Empty>
      )}
    </main>
  );
}

export default Favorites;
