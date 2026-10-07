import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Upload, ArrowLeft, CheckCircle2, AlertCircle, Camera } from 'lucide-react';

export const ComplaintForm = () => {
  const { currentUser, addComplaint } = useApp();
  const navigate = useNavigate();

  const [category, setCategory] = useState('Overflowing Bin');
  const [locationMode, setLocationMode] = useState('registered'); // 'registered' | 'custom'
  const [customAddress, setCustomAddress] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [submittedId, setSubmittedId] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalLocation =
      locationMode === 'registered'
        ? currentUser.address || 'Sector 12, Indira Nagar'
        : customAddress;

    const newRecord = addComplaint({
      citizenName: currentUser.name,
      category,
      location: finalLocation,
      description,
      photoUrl: previewUrl || 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
      zone: currentUser.zoneName || 'Sector 12',
    });

    setSubmittedId(newRecord.id);
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      {/* Back button link */}
      <div style={{ marginBottom: '16px' }}>
        <Link
          to="/dashboard"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            textDecoration: 'none',
            fontSize: '14px',
            color: 'var(--color-blue)',
            fontWeight: 500,
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Citizen Dashboard</span>
        </Link>
      </div>

      {submittedId ? (
        <div
          className="card"
          style={{
            borderLeft: '5px solid var(--color-blue)',
            padding: '32px 24px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'var(--status-resolved-bg)',
              color: 'var(--status-resolved-text)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}
          >
            <CheckCircle2 size={32} />
          </div>
          <h1 style={{ fontSize: '22px', marginBottom: '8px' }}>Complaint Successfully Lodged</h1>
          <p style={{ margin: '0 auto 16px', fontSize: '15px', color: 'var(--color-dark-brown-muted)' }}>
            Your incident report has been registered in the municipal dispatch database with tracking identifier:
          </p>
          <div
            style={{
              display: 'inline-block',
              backgroundColor: 'var(--color-cream-light)',
              border: '1px dashed var(--color-border)',
              padding: '8px 18px',
              fontSize: '18px',
              fontWeight: 700,
              color: 'var(--color-blue)',
              borderRadius: '4px',
              marginBottom: '24px',
            }}
          >
            {submittedId}
          </div>
          <p style={{ fontSize: '13px', color: 'var(--color-dark-brown-muted)', margin: '0 auto 24px' }}>
            The sanitary inspector and assigned driver for your zone have received this ticket. You will receive real-time status updates on your citizen dashboard.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link to="/dashboard" className="btn btn-primary">
              View on Dashboard
            </Link>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setSubmittedId(null);
                setDescription('');
                setSelectedFile(null);
                setPreviewUrl('');
              }}
            >
              Lodge Another Issue
            </button>
          </div>
        </div>
      ) : (
        <div className="card">
          <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '14px', marginBottom: '20px' }}>
            <h1 style={{ fontSize: '22px', color: 'var(--color-dark-brown)', marginBottom: '4px' }}>
              Lodge a Sanitation or Garbage Issue
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--color-dark-brown-muted)' }}>
              Report overflowing bins, missed door-to-door cycles, or illegal dumping for municipal action.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Category Dropdown */}
            <div className="form-group">
              <label className="form-label" htmlFor="category-select">
                Issue Category *
              </label>
              <select
                id="category-select"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option>Overflowing Bin</option>
                <option>Missed Collection</option>
                <option>Illegal Dumping</option>
                <option>Damaged / Broken Bin</option>
                <option>Hazardous / Dead Animal Waste</option>
              </select>
              <span className="form-helper">
                Accurate categorization ensures assignment to the correct municipal waste crew.
              </span>
            </div>

            {/* Location Selection */}
            <div className="form-group">
              <label className="form-label">Incident Location *</label>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="locationMode"
                    value="registered"
                    checked={locationMode === 'registered'}
                    onChange={() => setLocationMode('registered')}
                  />
                  <span>Use registered address ({currentUser.address})</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="locationMode"
                    value="custom"
                    checked={locationMode === 'custom'}
                    onChange={() => setLocationMode('custom')}
                  />
                  <span>Specify other location</span>
                </label>
              </div>

              {locationMode === 'custom' && (
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Near Community Center Park Gate, Sector 12"
                  value={customAddress}
                  onChange={(e) => setCustomAddress(e.target.value)}
                  required
                />
              )}
            </div>

            {/* Photo Upload Area (Design spec: dashed dark-brown border, drag-or-tap) */}
            <div className="form-group">
              <label className="form-label">
                Photo Evidence <span style={{ fontWeight: 400, color: 'var(--color-dark-brown-muted)' }}>(Optional but recommended)</span>
              </label>

              <label
                htmlFor="photo-upload"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px dashed var(--color-dark-brown)',
                  borderRadius: '6px',
                  backgroundColor: 'var(--color-cream-light)',
                  padding: '24px 16px',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                  textAlign: 'center',
                }}
              >
                {previewUrl ? (
                  <div>
                    <img
                      src={previewUrl}
                      alt="Upload Preview"
                      style={{
                        maxHeight: '160px',
                        maxWidth: '100%',
                        borderRadius: '4px',
                        marginBottom: '8px',
                        objectFit: 'cover',
                      }}
                    />
                    <div style={{ fontSize: '12px', color: 'var(--color-blue)', fontWeight: 600 }}>
                      Click to replace photo
                    </div>
                  </div>
                ) : (
                  <>
                    <Camera size={28} color="var(--color-dark-brown)" style={{ marginBottom: '8px' }} />
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-dark-brown)' }}>
                      Tap to upload photo or drag file here
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--color-dark-brown-muted)', marginTop: '4px' }}>
                      PNG, JPG up to 5MB (Connected to Cloudinary in Week 2)
                    </span>
                  </>
                )}
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            {/* Description Textarea */}
            <div className="form-group">
              <label className="form-label" htmlFor="description-input">
                Description of the Issue *
              </label>
              <textarea
                id="description-input"
                className="form-textarea"
                rows={4}
                placeholder="Describe the issue, landmarks, severity, or how long the trash has remained uncollected..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
                required
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                <span className="form-helper">Keep details factual to assist collection crew.</span>
                <span style={{ fontSize: '12px', color: 'var(--color-dark-brown-muted)' }}>
                  {description.length} / 500 characters
                </span>
              </div>
            </div>

            {/* Single Coral Submit Button per Design Spec */}
            <div style={{ marginTop: '24px' }}>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
              >
                Submit Incident Report
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
