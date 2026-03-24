import { useState, useRef } from 'react';
import { uploadFile } from '../services/fileApi';

export default function UploadCard({ onUploadSuccess }) {
  const [file, setFile]         = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const inputRef                = useRef();

  const ALLOWED = ['image/jpeg', 'image/png', 'application/pdf'];
  const MAX_SIZE = 5 * 1024 * 1024;

  const validate = (f) => {
    if (!ALLOWED.includes(f.type))  return 'Only JPG, PNG, PDF allowed.';
    if (f.size > MAX_SIZE)          return 'File must be under 5MB.';
    return null;
  };

  const handleSelect = (f) => {
    const err = validate(f);
    if (err) { setError(err); setFile(null); return; }
    setError('');
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleSelect(f);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const result = await uploadFile(file);
      onUploadSuccess(result);
      setFile(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (bytes) =>
    bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

  return (
    <div className="card">
      <h2 className="card-title">Upload Your File</h2>
      <p className="card-subtitle">Fast &amp; Secure File Sharing</p>

      {/* Drop Zone */}
      <div
        className={`drop-zone ${dragging ? 'drop-zone--active' : ''} ${file ? 'drop-zone--has-file' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !file && inputRef.current.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          style={{ display: 'none' }}
          onChange={(e) => e.target.files[0] && handleSelect(e.target.files[0])}
        />

        {!file ? (
          <>
            <div className="upload-icon">
              <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M17.5 19c2.5 0 4.5-2 4.5-4.5 0-2.3-1.7-4.1-3.9-4.4-.6-3.7-3.8-6.6-7.6-6.6-3.4 0-6.4 2.3-7.3 5.5C1.1 9.8 0 11.3 0 13.1c0 2.2 1.8 3.9 4 3.9h1"/>
                <polyline points="16 16 12 12 8 16"/>
                <line x1="12" y1="12" x2="12" y2="21"/>
              </svg>
            </div>
            <p className="drop-text">Drag &amp; Drop your files here</p>
            <span className="or-divider">or</span>
            <button className="btn btn-outline" type="button">Browse Files</button>
          </>
        ) : (
          <div className="file-preview">
            <div className="file-icon">
              {file.type === 'application/pdf' ? '📄' : '🖼️'}
            </div>
            <div className="file-info">
              <span className="file-name">{file.name}</span>
              <span className="file-size">{formatSize(file.size)}</span>
            </div>
            <button
              className="remove-btn"
              type="button"
              onClick={(e) => { e.stopPropagation(); setFile(null); }}
            >✕</button>
          </div>
        )}
      </div>

      {error && <p className="error-msg">⚠ {error}</p>}

      <button
        className={`btn btn-primary btn-full ${loading ? 'btn--loading' : ''}`}
        onClick={handleSubmit}
        disabled={!file || loading}
      >
        {loading ? (
          <span className="spinner-wrap">
            <span className="spinner" />
            Uploading...
          </span>
        ) : 'Upload File'}
      </button>

      <p className="footer-note">Max 5MB · JPG, PNG, PDF</p>
    </div>
  );
}
