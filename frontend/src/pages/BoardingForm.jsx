import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft,
  Check,
  ArrowRight,
  Upload,
  Trash2,
  Sparkles,
  Plus,
} from 'lucide-react';
import Pill from '../components/Pill.jsx';
import Loading from '../components/Loading.jsx';
import api from '../services/api.js';
import { IMAGES, AMENITIES, ROOM_TYPES, GENDER_PREFERENCES } from '../data/constants.js';

const BLANK = {
  title: '',
  city: 'Matara',
  location: '',
  description: '',
  price: '',
  deposit: '0',
  type: 'Single Room',
  gender: 'Any',
  beds: 1,
  baths: 1,
  availableSpots: 1,
  amenities: ['Wi-Fi'],
  image: IMAGES[0],
  images: [IMAGES[0]],
  phone: '',
};

function BoardingForm() {
  const { id } = useParams();
  const edit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(BLANK);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(edit);
  const [error, setError] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [fileError, setFileError] = useState('');

  useEffect(() => {
    if (edit) {
      api(`/boardings/${id}`)
        .then((data) => {
          const imgs =
            Array.isArray(data.images) && data.images.length > 0
              ? data.images
              : data.image
                ? [data.image]
                : [IMAGES[0]];
          setForm({
            ...data,
            images: imgs,
            image: imgs[0],
          });
        })
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }
  }, [id, edit]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const toggleAmenity = (a) =>
    set(
      'amenities',
      form.amenities.includes(a)
        ? form.amenities.filter((x) => x !== a)
        : [...form.amenities, a]
    );

  // Add multiple image files from local disk
  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setFileError('');

    const maxSizeBytes = 5 * 1024 * 1024; // 5MB limit
    const validFiles = [];

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setFileError(`"${file.name}" is not a supported image file.`);
        return;
      }
      if (file.size > maxSizeBytes) {
        setFileError(`"${file.name}" exceeds the 5MB file size limit.`);
        return;
      }
      validFiles.push(file);
    }

    // Read all selected files as Data URLs
    Promise.all(
      validFiles.map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('Failed to read image file.'));
            reader.readAsDataURL(file);
          })
      )
    )
      .then((dataUrls) => {
        setForm((prev) => {
          const current = Array.isArray(prev.images) ? prev.images : [];
          const updated = [...current, ...dataUrls];
          return {
            ...prev,
            images: updated,
            image: updated[0] || '',
          };
        });
        e.target.value = ''; // Reset file input
      })
      .catch((err) => {
        setFileError(err.message);
      });
  };

  // Add custom URL
  const handleAddUrl = (e) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    if (!/^https?:\/\//i.test(customUrl.trim())) {
      setFileError('Please enter a valid URL starting with http:// or https://');
      return;
    }
    setFileError('');
    setForm((prev) => {
      const current = Array.isArray(prev.images) ? prev.images : [];
      const updated = [...current, customUrl.trim()];
      return {
        ...prev,
        images: updated,
        image: updated[0] || '',
      };
    });
    setCustomUrl('');
  };

  // Remove photo by index
  const removePhoto = (index) => {
    setForm((prev) => {
      const current = Array.isArray(prev.images) ? prev.images : [];
      const updated = current.filter((_, i) => i !== index);
      return {
        ...prev,
        images: updated,
        image: updated[0] || '',
      };
    });
  };

  // Make selected photo the primary cover image
  const makeCover = (index) => {
    setForm((prev) => {
      const current = Array.isArray(prev.images) ? prev.images : [];
      const target = current[index];
      const rest = current.filter((_, i) => i !== index);
      const updated = [target, ...rest];
      return {
        ...prev,
        images: updated,
        image: target,
      };
    });
  };

  // Add a sample image
  const addSampleImage = (imgUrl) => {
    setForm((prev) => {
      const current = Array.isArray(prev.images) ? prev.images : [];
      if (current.includes(imgUrl)) return prev;
      const updated = [...current, imgUrl];
      return {
        ...prev,
        images: updated,
        image: updated[0] || '',
      };
    });
  };

  async function save(e) {
    e.preventDefault();
    setError('');

    const imagesToSave =
      Array.isArray(form.images) && form.images.length > 0
        ? form.images
        : form.image
          ? [form.image]
          : [];

    if (!imagesToSave.length) {
      setError('Please add at least one photo for your boarding space.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setBusy(true);
    try {
      const payload = {
        ...form,
        images: imagesToSave,
        image: imagesToSave[0],
      };

      await api(edit ? `/boardings/${id}` : '/boardings', {
        method: edit ? 'PUT' : 'POST',
        body: JSON.stringify(payload),
      });
      navigate('/dashboard');
    } catch (e) {
      setError(e.message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <Loading />;

  const currentPhotos =
    Array.isArray(form.images) && form.images.length > 0
      ? form.images
      : form.image
        ? [form.image]
        : [];

  return (
    <main className="page-width inner-page form-page">
      <Link to="/dashboard" className="back-link">
        <ChevronLeft size={18} /> Back to dashboard
      </Link>
      <div className="form-top">
        <Pill>PROPERTY MANAGEMENT</Pill>
        <h1>
          {edit ? 'Edit your' : 'List a new'} <em>boarding space</em>
        </h1>
        <p>
          {edit
            ? 'Update your listing details and manage photos.'
            : 'Share your space with students searching for a new home.'}
        </p>
      </div>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <form onSubmit={save} className="boarding-form">
        {/* Section 01: Basic information */}
        <div className="form-section">
          <div className="form-section-header">
            <span>01</span>
            <div>
              <h2>Basic information</h2>
              <p>Let's start with the essentials</p>
            </div>
          </div>
          <div className="form-fields">
            <label className="field-wide">
              Property title{' '}
              <input
                required
                minLength={5}
                maxLength={100}
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="e.g. Cozy studio near Ruhuna University"
              />
            </label>
            <label>
              City{' '}
              <input
                required
                value={form.city}
                onChange={(e) => set('city', e.target.value)}
                placeholder="e.g. Matara"
              />
            </label>
            <label>
              Area / location{' '}
              <input
                required
                value={form.location}
                onChange={(e) => set('location', e.target.value)}
                placeholder="e.g. Wellamadama"
              />
            </label>
            <label>
              Room type{' '}
              <select
                value={form.type}
                onChange={(e) => set('type', e.target.value)}
              >
                {ROOM_TYPES.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label>
              Preferred tenants{' '}
              <select
                value={form.gender}
                onChange={(e) => set('gender', e.target.value)}
              >
                {GENDER_PREFERENCES.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label className="field-wide">
              Description{' '}
              <textarea
                required
                minLength={20}
                rows={5}
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="Describe your space, nearby facilities, travel convenience and what makes it special..."
              />
            </label>
          </div>
        </div>

        {/* Section 02: Pricing & availability */}
        <div className="form-section">
          <div className="form-section-header">
            <span>02</span>
            <div>
              <h2>Pricing & availability</h2>
              <p>Help students understand your offering</p>
            </div>
          </div>
          <div className="form-fields">
            <label>
              Monthly rent (LKR){' '}
              <input
                required
                type="number"
                min="1000"
                step="500"
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
                placeholder="15000"
              />
            </label>
            <label>
              Deposit (LKR){' '}
              <input
                type="number"
                min="0"
                step="500"
                value={form.deposit}
                onChange={(e) => set('deposit', e.target.value)}
              />
            </label>
            <label>
              Bedrooms / beds{' '}
              <input
                required
                type="number"
                min="1"
                max="20"
                value={form.beds}
                onChange={(e) => set('beds', e.target.value)}
              />
            </label>
            <label>
              Bathrooms{' '}
              <input
                required
                type="number"
                min="1"
                max="10"
                value={form.baths}
                onChange={(e) => set('baths', e.target.value)}
              />
            </label>
            <label>
              Available spots{' '}
              <input
                required
                type="number"
                min="0"
                max="100"
                value={form.availableSpots}
                onChange={(e) => set('availableSpots', e.target.value)}
              />
            </label>
            <label>
              Contact number{' '}
              <input
                required
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                placeholder="0771234567"
              />
            </label>
          </div>
        </div>

        {/* Section 03: Amenities & Photos */}
        <div className="form-section">
          <div className="form-section-header">
            <span>03</span>
            <div>
              <h2>Amenities & photos</h2>
              <p>Show students what makes your place comfortable</p>
            </div>
          </div>

          <div className="amenity-choices">
            {AMENITIES.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => toggleAmenity(a)}
                className={`amenity-choice ${form.amenities.includes(a) ? 'selected' : ''}`}
              >
                <Check size={15} />
                {a}
              </button>
            ))}
          </div>

          <div style={{ marginTop: '24px', borderTop: '1px solid #e5eae2', paddingTop: '24px' }}>
            <h3 style={{ fontSize: '18px', margin: '0 0 6px' }}>Boarding photos</h3>
            <p className="field-help" style={{ marginBottom: '16px' }}>
              Upload multiple images from your computer or phone, or add image URLs. The first photo will be used as the primary cover photo.
            </p>

            {fileError && (
              <p className="form-error" role="alert" style={{ marginBottom: '14px' }}>
                {fileError}
              </p>
            )}

            {/* Upload multiple files */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '20px' }}>
              <label
                className="btn btn-dark"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  margin: 0,
                }}
              >
                <Upload size={17} /> Choose photos to upload
                <input
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  onChange={handleFiles}
                  style={{ display: 'none' }}
                />
              </label>

              <span style={{ fontSize: '13px', color: 'var(--muted, #666)' }}>
                PNG, JPG, WEBP (Max 5MB each)
              </span>
            </div>

            {/* Photo preview gallery */}
            {currentPhotos.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '10px' }}>
                  Selected photos ({currentPhotos.length})
                </h4>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                    gap: '14px',
                  }}
                >
                  {currentPhotos.map((photoUrl, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: 'relative',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        border: idx === 0 ? '2px solid #22734b' : '1px solid #dcdfd8',
                        background: '#f7f8f6',
                        aspectRatio: '4/3',
                      }}
                    >
                      <img
                        src={photoUrl}
                        alt={`Boarding photo ${idx + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                      {idx === 0 && (
                        <span
                          style={{
                            position: 'absolute',
                            top: '6px',
                            left: '6px',
                            background: '#22734b',
                            color: '#fff',
                            fontSize: '10px',
                            fontWeight: '800',
                            padding: '3px 7px',
                            borderRadius: '6px',
                          }}
                        >
                          Cover Photo
                        </span>
                      )}
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '6px',
                          right: '6px',
                          display: 'flex',
                          gap: '4px',
                        }}
                      >
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => makeCover(idx)}
                            title="Make cover photo"
                            style={{
                              background: 'rgba(0,0,0,0.65)',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '4px 6px',
                              fontSize: '10px',
                              cursor: 'pointer',
                            }}
                          >
                            Set Cover
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removePhoto(idx)}
                          title="Remove photo"
                          style={{
                            background: '#b53f40',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '4px 6px',
                            display: 'grid',
                            placeItems: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add by URL */}
            <div
              style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
                maxWidth: '650px',
                marginBottom: '24px',
              }}
            >
              <input
                type="url"
                placeholder="Or paste an image URL (e.g. https://...)"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                style={{ flex: 1 }}
              />
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={handleAddUrl}
              >
                <Plus size={16} /> Add URL
              </button>
            </div>

            {/* Sample preset choices */}
            <h4 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '8px' }}>
              Or add sample demo photos:
            </h4>
            <div className="image-choices">
              {IMAGES.map((x) => {
                const isSelected = currentPhotos.includes(x);
                return (
                  <button
                    type="button"
                    key={x}
                    className={`image-choice ${isSelected ? 'active' : ''}`}
                    onClick={() => (isSelected ? null : addSampleImage(x))}
                    title={isSelected ? 'Already added' : 'Click to add photo'}
                  >
                    <img src={x} alt="Sample room" />
                    {isSelected && (
                      <span>
                        <Check size={18} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <Link to="/dashboard" className="btn btn-outline">
            Cancel
          </Link>
          <button className="btn btn-dark" type="submit" disabled={busy}>
            {busy ? 'Saving...' : edit ? 'Save changes' : 'Publish boarding'}{' '}
            <ArrowRight size={17} />
          </button>
        </div>
      </form>
    </main>
  );
}

export default BoardingForm;
