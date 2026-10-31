import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Heart,
  BadgeCheck,
  BedDouble,
  Bath,
  Users,
  CheckCircle2,
  Phone,
  MessageCircle,
  CalendarDays,
  Check,
} from 'lucide-react';
import Pill from '../components/Pill.jsx';
import Loading from '../components/Loading.jsx';
import Empty from '../components/Empty.jsx';
import api from '../services/api.js';
import { currency } from '../utils/formatters.js';
import { FALLBACK_IMAGE } from '../data/constants.js';

function Details({ favorites, toggleFavorite, user }) {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState('');
  const [activePhoto, setActivePhoto] = useState(0);

  // Accommodation request modal state
  const [requestOpen, setRequestOpen] = useState(false);
  const [moveInDate, setMoveInDate] = useState('');
  const [requestMessage, setRequestMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState('');
  const [requestError, setRequestError] = useState('');

  useEffect(() => {
    setItem(null);
    setActivePhoto(0);
    api(`/boardings/${id}`)
      .then(setItem)
      .catch((e) => setError(e.message));
  }, [id]);

  async function handleRequestSubmit(e) {
    e.preventDefault();
    setRequestError('');
    setRequestSuccess('');
    setSubmitting(true);
    try {
      await api('/requests', {
        method: 'POST',
        body: JSON.stringify({
          boardingId: item._id,
          moveInDate,
          message: requestMessage,
        }),
      });
      setRequestSuccess('Request sent successfully! The owner will review your details.');
      setRequestMessage('');
      setMoveInDate('');
    } catch (err) {
      setRequestError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (error) {
    return (
      <div className="page-width">
        <Empty title="Listing not available" text={error}>
          <Link className="btn btn-dark" to="/explore">
            Explore boardings
          </Link>
        </Empty>
      </div>
    );
  }

  if (!item) return <Loading />;

  const liked = favorites.includes(item._id);
  const tel = (item.phone || '').replace(/[^0-9+]/g, '');
  const todayStr = new Date().toISOString().split('T')[0];
  const galleryImages =
    Array.isArray(item.images) && item.images.length > 0
      ? item.images
      : [item.image || FALLBACK_IMAGE];
  const safeActiveIndex =
    activePhoto >= 0 && activePhoto < galleryImages.length ? activePhoto : 0;

  return (
    <main className="page-width inner-page detail-page">
      <div className="detail-breadcrumb">
        <Link to="/explore">
          <ChevronLeft size={17} /> Back to explore
        </Link>
        <span> / </span>
        {item.city} <span> / </span> <strong>{item.title}</strong>
      </div>
      <div className="detail-top">
        <div>
          <Pill>{item.type.toUpperCase()}</Pill>
          <h1>{item.title}</h1>
          <p className="detail-location">
            <MapPin size={17} />
            {item.location}, {item.city}
          </p>
        </div>
        <button
          className={`btn btn-outline ${liked ? 'saved-outline' : ''}`}
          onClick={() => toggleFavorite(item._id)}
        >
          <Heart size={17} fill={liked ? 'currentColor' : 'none'} />
          {liked ? 'Saved' : 'Save this space'}
        </button>
      </div>

      <div className="detail-gallery">
        <div className="detail-photo">
          <img
            src={galleryImages[safeActiveIndex]}
            alt={`${item.title} - photo ${safeActiveIndex + 1}`}
            onError={(e) => {
              e.currentTarget.src = FALLBACK_IMAGE;
            }}
          />
          <span className="photo-label">
            <BadgeCheck size={17} />{' '}
            {galleryImages.length > 1
              ? `Photo ${safeActiveIndex + 1} of ${galleryImages.length}`
              : 'Boarding listing'}
          </span>
          {galleryImages.length > 1 && (
            <div className="gallery-nav-controls">
              <button
                type="button"
                className="gallery-nav-btn gallery-prev"
                aria-label="Previous photo"
                onClick={() =>
                  setActivePhoto((prev) =>
                    prev > 0 ? prev - 1 : galleryImages.length - 1
                  )
                }
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                className="gallery-nav-btn gallery-next"
                aria-label="Next photo"
                onClick={() =>
                  setActivePhoto((prev) =>
                    prev < galleryImages.length - 1 ? prev + 1 : 0
                  )
                }
              >
                <ChevronRight size={22} />
              </button>
            </div>
          )}
        </div>

        {galleryImages.length > 1 && (
          <div
            className="gallery-thumbs"
            role="tablist"
            aria-label="Boarding photos"
          >
            {galleryImages.map((imgUrl, idx) => (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-selected={safeActiveIndex === idx}
                aria-label={`View photo ${idx + 1}`}
                className={`gallery-thumb ${
                  safeActiveIndex === idx ? 'active' : ''
                }`}
                onClick={() => setActivePhoto(idx)}
              >
                <img
                  src={imgUrl}
                  alt={`Thumbnail ${idx + 1}`}
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                />
                {idx === 0 && <span className="gallery-thumb-tag">Cover</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="detail-layout">
        <div className="detail-main">
          <div className="facts-row">
            <div>
              <BedDouble />
              <span>
                <strong>{item.beds}</strong> Bedrooms
              </span>
            </div>
            <div>
              <Bath />
              <span>
                <strong>{item.baths}</strong> Bathrooms
              </span>
            </div>
            <div>
              <Users />
              <span>
                <strong>
                  {item.gender === 'Any' ? 'Everyone' : item.gender}
                </strong>{' '}
                Preference
              </span>
            </div>
            <div>
              <CheckCircle2 />
              <span>
                <strong>{item.availableSpots}</strong> Spots left
              </span>
            </div>
          </div>
          <section className="detail-section">
            <h2>About this space</h2>
            <p>{item.description}</p>
          </section>
          <section className="detail-section">
            <h2>What this place offers</h2>
            <div className="amenities-grid">
              {item.amenities?.length ? (
                item.amenities.map((a) => (
                  <div key={a}>
                    <CheckCircle2 size={18} />
                    {a}
                  </div>
                ))
              ) : (
                <p>No amenities specified</p>
              )}
            </div>
          </section>
          <section className="detail-section">
            <h2>Location</h2>
            <div className="location-tile">
              <div className="location-pin">
                <MapPin />
              </div>
              <div>
                <strong>
                  {item.location}, {item.city}
                </strong>
                <span>
                  Sri Lanka · Contact the owner for the exact address.
                </span>
              </div>
            </div>
          </section>
        </div>
        <aside className="booking-panel">
          <div className="booking-price">
            <strong>{currency(item.price)}</strong>
            <span>/ month</span>
          </div>
          <p className="booking-sub">Reserve your space or contact directly</p>
          <div className="booking-details">
            <div>
              <span>Room type</span>
              <b>{item.type}</b>
            </div>
            <div>
              <span>Refundable deposit*</span>
              <b>{currency(item.deposit)}</b>
            </div>
            <div>
              <span>Availability</span>
              <b className="status-green">
                {item.availableSpots > 0
                  ? `${item.availableSpots} spots open`
                  : 'Fully occupied'}
              </b>
            </div>
          </div>

          {/* In-App Accommodation Request for students */}
          {user?.role === 'student' && (
            <button
              className="btn btn-dark btn-full"
              style={{ marginBottom: '8px' }}
              onClick={() => {
                setRequestOpen(true);
                setRequestSuccess('');
                setRequestError('');
              }}
            >
              <CalendarDays size={18} /> Request accommodation
            </button>
          )}

          {/* Direct call & WhatsApp links */}
          <a className="btn btn-outline btn-full" href={`tel:${tel}`}>
            <Phone size={18} /> Call the owner
          </a>
          <a
            className="btn btn-subtle btn-full"
            href={`https://wa.me/${tel.startsWith('0') ? '94' + tel.slice(1) : tel.replace('+', '')}?text=${encodeURIComponent('Hello, I am interested in your boarding listing: ' + item.title)}`}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={18} /> WhatsApp owner
          </a>

          <div className="owner-small">
            <div className="owner-avatar">{(item.owner?.name || 'O')[0]}</div>
            <div>
              <strong>{item.owner?.name || 'Boarding owner'}</strong>
              <span>Property owner</span>
            </div>
            <BadgeCheck size={20} />
          </div>
          <small>*Confirm payment terms directly with the owner.</small>
        </aside>
      </div>

      {/* Accommodation Request Modal */}
      {requestOpen && (
        <div
          className="modal-overlay"
          role="presentation"
          onClick={() => setRequestOpen(false)}
        >
          <div
            className="request-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Request accommodation"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Request this boarding space</h2>
            <p>
              Submit an accommodation request to <b>{item.owner?.name || 'the owner'}</b> for <b>{item.title}</b>.
            </p>

            {requestSuccess ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    padding: '12px',
                    borderRadius: '50%',
                    background: '#e8f5e9',
                    color: '#2e7d32',
                    marginBottom: '12px',
                  }}
                >
                  <Check size={28} />
                </div>
                <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Request sent!</h3>
                <p style={{ marginBottom: '20px' }}>{requestSuccess}</p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <Link to="/requests" className="btn btn-dark">
                    View my requests
                  </Link>
                  <button className="btn btn-outline" onClick={() => setRequestOpen(false)}>
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit}>
                {requestError && (
                  <p className="form-error" role="alert" style={{ margin: 0 }}>
                    {requestError}
                  </p>
                )}
                <label>
                  Preferred move-in date
                  <input
                    type="date"
                    required
                    min={todayStr}
                    value={moveInDate}
                    onChange={(e) => setMoveInDate(e.target.value)}
                  />
                </label>
                <label>
                  Message to owner
                  <textarea
                    required
                    minLength={5}
                    maxLength={500}
                    rows={4}
                    placeholder="Tell the owner about yourself (e.g. University year, expected length of stay, any questions)..."
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                  />
                </label>
                <div className="modal-buttons" style={{ marginTop: '8px' }}>
                  <button
                    type="button"
                    className="btn btn-outline"
                    disabled={submitting}
                    onClick={() => setRequestOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-dark"
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting...' : 'Send request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default Details;
