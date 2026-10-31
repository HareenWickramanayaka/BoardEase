import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, CircleHelp } from 'lucide-react';
import Pill from '../components/Pill.jsx';
import Loading from '../components/Loading.jsx';
import Empty from '../components/Empty.jsx';
import Cards from '../components/Cards.jsx';
import api from '../services/api.js';
import { currency } from '../utils/formatters.js';

function Explore({ favorites, toggleFavorite }) {
  const [params, setParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: params.get('search') || '',
    type: params.get('type') || '',
    gender: params.get('gender') || '',
    maxPrice: params.get('maxPrice') || '',
    sort: params.get('sort') || 'newest',
  });
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const current = Object.fromEntries([...params.entries()]);
    setFilters({
      search: current.search || '',
      type: current.type || '',
      gender: current.gender || '',
      maxPrice: current.maxPrice || '',
      sort: current.sort || 'newest',
    });
  }, [params]);

  useEffect(() => {
    setLoading(true);
    setError('');
    api('/boardings' + (params.toString() ? `?${params}` : ''))
      .then(setList)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [params]);

  function update(e) {
    e.preventDefault();
    const searchParams = {};
    Object.entries(filters).forEach(([k, v]) => {
      if (v && !(k === 'sort' && v === 'newest')) searchParams[k] = v;
    });
    setParams(searchParams);
  }

  return (
    <main className="page-width inner-page">
      <div className="inner-heading">
        <Pill>FIND YOUR HAPPY PLACE</Pill>
        <h1>
          Explore <em>boarding spaces</em>
        </h1>
        <p>
          Discover your next home with comfort, convenience and a budget that
          works for you
        </p>
      </div>
      <form className="filter-panel" onSubmit={update}>
        <div className="filter-search">
          <Search size={19} />
          <input
            placeholder="Location or keyword"
            aria-label="Search"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <label>
          <span>Room type</span>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="">All types</option>
            {['Single Room', 'Shared Room', 'Annex', 'Studio'].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Preferred for</span>
          <select
            value={filters.gender}
            onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
          >
            <option value="">Everyone</option>
            <option>Male</option>
            <option>Female</option>
          </select>
        </label>
        <label>
          <span>Maximum rent</span>
          <select
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters({ ...filters, maxPrice: e.target.value })
            }
          >
            <option value="">Any price</option>
            {[10000, 15000, 20000, 30000, 40000].map((x) => (
              <option key={x} value={x}>
                Under {currency(x)}
              </option>
            ))}
          </select>
        </label>
        <button className="btn btn-dark filter-submit" type="submit">
          <SlidersHorizontal size={16} /> Apply filters
        </button>
      </form>
      <div className="results-bar">
        <div>
          <h2>
            Available spaces <span>({list.length})</span>
          </h2>
          <p>Find somewhere you'll love coming back to</p>
        </div>
        <label className="sort-select">
          Sort by{' '}
          <select
            value={filters.sort}
            onChange={(e) => {
              setFilters({ ...filters, sort: e.target.value });
              setParams({
                ...Object.fromEntries(params),
                sort: e.target.value,
              });
            }}
          >
            <option value="newest">Newest first</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
        </label>
      </div>
      {loading ? (
        <Loading />
      ) : error ? (
        <Empty icon={CircleHelp} title="Unable to load listings" text={error} />
      ) : list.length ? (
        <Cards
          items={list}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
        />
      ) : (
        <Empty
          icon={Search}
          title="No spaces found"
          text="Try a different location or change your filters."
        >
          <button className="btn btn-dark" onClick={() => setParams({})}>
            Clear filters
          </button>
        </Empty>
      )}
    </main>
  );
}

export default Explore;
