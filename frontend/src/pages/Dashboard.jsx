import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Building2,
  CheckCircle2,
  Users,
  ArrowUpRight,
  MapPin,
  Edit3,
  Trash2,
  HousePlus,
  CalendarDays,
  Clock,
  XCircle,
  UserRound,
} from 'lucide-react';
import Pill from '../components/Pill.jsx';
import Loading from '../components/Loading.jsx';
import Empty from '../components/Empty.jsx';
import api from '../services/api.js';
import { currency } from '../utils/formatters.js';
import { FALLBACK_IMAGE } from '../data/constants.js';

function Dashboard({ user }) {
  const [tab, setTab] = useState('properties');
  const [mine, setMine] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);
  const [working, setWorking] = useState(false);
  const [actionId, setActionId] = useState(null);

  async function load() {
    try {
      const [boardingsData, requestsData] = await Promise.all([
        api('/boardings/mine'),
        api('/requests/owner'),
      ]);
      setMine(boardingsData);
      setRequests(requestsData);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function remove() {
    if (!deleting) return;
    setWorking(true);
    try {
      await api(`/boardings/${deleting._id}`, { method: 'DELETE' });
      setDeleting(null);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setWorking(false);
    }
  }

  async function updateStatus(reqId, newStatus) {
    setActionId(reqId);
    try {
      const updated = await api(`/requests/${reqId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      setRequests((prev) =>
        prev.map((r) => (r._id === reqId ? updated : r))
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setActionId(null);
    }
  }

  const pendingRequests = requests.filter((r) => r.status === 'pending');

  return (
    <main className="page-width inner-page dashboard-page">
      <div className="dashboard-intro">
        <div>
          <Pill>OWNER DASHBOARD</Pill>
          <h1>
            Hello, {user.name.split(' ')[0]} <span>✳</span>
          </h1>
          <p>Here's an overview of the spaces and requests you're managing</p>
        </div>
        <Link to="/dashboard/new" className="btn btn-dark">
          <Plus size={18} /> Add new boarding
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div>
            <Building2 size={22} />
          </div>
          <span>Total listings</span>
          <strong>{mine.length}</strong>
          <small>Properties you've listed</small>
        </div>
        <div className="stat-card">
          <div>
            <CalendarDays size={22} />
          </div>
          <span>New inquiries</span>
          <strong>{pendingRequests.length}</strong>
          <small>Awaiting your decision</small>
        </div>
        <div className="stat-card">
          <div>
            <Users size={22} />
          </div>
          <span>Total spots open</span>
          <strong>{mine.reduce((n, x) => n + x.availableSpots, 0)}</strong>
          <small>Across your boardings</small>
        </div>
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        <button
          className={`dashboard-tab ${tab === 'properties' ? 'active' : ''}`}
          onClick={() => setTab('properties')}
        >
          <Building2 size={17} /> Your properties ({mine.length})
        </button>
        <button
          className={`dashboard-tab ${tab === 'requests' ? 'active' : ''}`}
          onClick={() => setTab('requests')}
        >
          <CalendarDays size={17} /> Booking requests
          {pendingRequests.length > 0 && (
            <span className="badge-count">{pendingRequests.length}</span>
          )}
        </button>
      </div>

      {error && <p className="form-error">{error}</p>}

      {loading ? (
        <Loading />
      ) : tab === 'properties' ? (
        /* Properties Section */
        mine.length ? (
          <div className="dashboard-list">
            {mine.map((x) => (
              <div className="dashboard-item" key={x._id}>
                <img
                  src={x.image}
                  alt={x.title}
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                />
                <div className="dash-item-main">
                  <strong>{x.title}</strong>
                  <span>
                    <MapPin size={14} /> {x.location}, {x.city}
                  </span>
                  <small>
                    {x.type} · {currency(x.price)} / month
                  </small>
                </div>
                <span
                  className={`availability-chip ${x.availableSpots === 0 ? 'unavailable' : ''}`}
                >
                  {x.availableSpots > 0 ? 'Available' : 'Full'}
                </span>
                <div className="dash-item-actions">
                  <Link
                    to={`/boarding/${x._id}`}
                    className="icon-button"
                    title="View listing"
                  >
                    <ArrowUpRight size={18} />
                  </Link>
                  <Link
                    to={`/dashboard/edit/${x._id}`}
                    className="icon-button"
                    title="Edit listing"
                  >
                    <Edit3 size={18} />
                  </Link>
                  <button
                    className="icon-button delete-button"
                    title="Delete listing"
                    onClick={() => setDeleting(x)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty
            icon={HousePlus}
            title="Let's list your first property"
            text="Share your boarding space with students looking for a home."
          >
            <Link to="/dashboard/new" className="btn btn-dark">
              <Plus size={17} /> Add a boarding
            </Link>
          </Empty>
        )
      ) : (
        /* Booking Requests Section */
        requests.length ? (
          <div className="request-list">
            {requests.map((r) => {
              const student = r.student || {};
              const boarding = r.boarding || {};
              const moveDate = r.moveInDate
                ? new Date(r.moveInDate).toLocaleDateString('en-LK', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : 'N/A';

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
                          {boarding.title || 'Boarding listing'}
                        </h3>
                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted, #666)' }}>
                          Applicant:{' '}
                          <strong style={{ color: 'inherit' }}>
                            <UserRound size={13} style={{ verticalAlign: 'middle', marginRight: '3px' }} />
                            {student.name || 'Student'}
                          </strong>{' '}
                          ({student.email})
                        </p>
                      </div>
                    </div>

                    <div>
                      {r.status === 'pending' && (
                        <span className="status-pill pending">
                          <Clock size={13} /> Pending
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
                      <strong>Requested move-in date:</strong> {moveDate}
                    </div>
                    <div>
                      <strong>Student note:</strong> "{r.message}"
                    </div>
                  </div>

                  {r.status === 'pending' && (
                    <div className="request-actions">
                      <button
                        className="btn btn-outline btn-sm"
                        disabled={actionId === r._id}
                        onClick={() => updateStatus(r._id, 'rejected')}
                      >
                        Decline
                      </button>
                      <button
                        className="btn btn-dark btn-sm"
                        disabled={actionId === r._id}
                        onClick={() => updateStatus(r._id, 'accepted')}
                      >
                        Accept request
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <Empty
            icon={CalendarDays}
            title="No booking requests yet"
            text="When students apply for your spaces, their inquiries will appear here for you to accept or decline."
          />
        )
      )}

      {deleting && (
        <div
          className="modal-overlay"
          role="presentation"
          onClick={() => setDeleting(null)}
        >
          <div
            className="confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Delete confirmation"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-danger-icon">
              <Trash2 size={25} />
            </div>
            <h2>Delete this listing?</h2>
            <p>
              Are you sure you want to delete <b>{deleting.title}</b>? This
              action cannot be undone
            </p>
            <div className="modal-buttons">
              <button
                className="btn btn-outline"
                disabled={working}
                onClick={() => setDeleting(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                disabled={working}
                onClick={remove}
              >
                {working ? 'Deleting...' : 'Delete listing'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Dashboard;
