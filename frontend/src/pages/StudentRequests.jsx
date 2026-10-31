import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Phone,
  MessageCircle,
  ArrowUpRight,
} from 'lucide-react';
import Pill from '../components/Pill.jsx';
import Loading from '../components/Loading.jsx';
import Empty from '../components/Empty.jsx';
import api from '../services/api.js';
import { currency } from '../utils/formatters.js';
import { FALLBACK_IMAGE } from '../data/constants.js';

function StudentRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/requests/student')
      .then(setRequests)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="page-width inner-page">
      <div className="inner-heading">
        <Pill>YOUR APPLICATIONS</Pill>
        <h1>
          Accommodation <em>requests</em>
        </h1>
        <p>Track the status of your stay inquiries with boarding owners</p>
      </div>

      {error && <p className="form-error">{error}</p>}

      {loading ? (
        <Loading />
      ) : requests.length ? (
        <div className="request-list">
          {requests.map((r) => {
            const boarding = r.boarding || {};
            const owner = r.owner || {};
            const moveDate = r.moveInDate
              ? new Date(r.moveInDate).toLocaleDateString('en-LK', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              : 'N/A';
            const tel = (boarding.phone || '').replace(/[^0-9+]/g, '');

            return (
              <div key={r._id} className="request-item">
                <div className="request-item-top">
                  <div className="request-property-info">
                    <img
                      src={boarding.image || FALLBACK_IMAGE}
                      alt={boarding.title || 'Boarding'}
                      onError={(e) => {
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                    />
                    <div>
                      <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>
                        {boarding.title || 'Boarding space'}
                      </h3>
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted, #666)' }}>
                        <MapPin size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                        {boarding.location}, {boarding.city} · {boarding.type} ·{' '}
                        {currency(boarding.price)} / month
                      </p>
                    </div>
                  </div>

                  <div>
                    {r.status === 'pending' && (
                      <span className="status-pill pending">
                        <Clock size={13} /> Pending review
                      </span>
                    )}
                    {r.status === 'accepted' && (
                      <span className="status-pill accepted">
                        <CheckCircle2 size={13} /> Accepted
                      </span>
                    )}
                    {r.status === 'rejected' && (
                      <span className="status-pill rejected">
                        <XCircle size={13} /> Declined
                      </span>
                    )}
                  </div>
                </div>

                <div className="request-message-box">
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                    <CalendarDays size={15} />
                    <strong>Requested move-in:</strong> {moveDate}
                  </div>
                  <div>
                    <strong>Your note:</strong> "{r.message}"
                  </div>
                </div>

                <div className="request-actions">
                  {r.status === 'accepted' && tel && (
                    <>
                      <a className="btn btn-outline btn-sm" href={`tel:${tel}`}>
                        <Phone size={15} /> Call {owner.name || 'Owner'}
                      </a>
                      <a
                        className="btn btn-subtle btn-sm"
                        href={`https://wa.me/${tel.startsWith('0') ? '94' + tel.slice(1) : tel.replace('+', '')}?text=${encodeURIComponent('Hello ' + (owner.name || '') + ', my accommodation request was accepted for ' + (boarding.title || 'your listing'))}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <MessageCircle size={15} /> WhatsApp
                      </a>
                    </>
                  )}
                  {boarding._id && (
                    <Link to={`/boarding/${boarding._id}`} className="btn btn-dark btn-sm">
                      View listing <ArrowUpRight size={15} />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Empty
          icon={CalendarDays}
          title="No requests submitted yet"
          text="When you find a boarding space you like, click 'Request accommodation' to notify the owner."
        >
          <Link className="btn btn-dark" to="/explore">
            Explore spaces <ArrowRight size={16} />
          </Link>
        </Empty>
      )}
    </main>
  );
}

export default StudentRequests;
