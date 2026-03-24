import { useState } from 'react';
import { getFileById } from '../services/fileApi';

export default function FileResultCard({ uploadedFile }) {
  const [fileId, setFileId]   = useState('');
  const [result, setResult]   = useState(uploadedFile || null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [copied, setCopied]   = useState(false);

  const handleSearch = async () => {
    if (!fileId.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await getFileById(fileId.trim());
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result?.url) return;
    navigator.clipboard.writeText(result.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

  // Update result when parent passes uploadedFile
  if (uploadedFile && uploadedFile !== result && !result) {
    setResult(uploadedFile);
  }

  return (
    <div className="card">
      <h2 className="card-title">Get File</h2>
      <p className="card-subtitle">Search by File ID</p>

      {/* Search Input */}
      <div className="search-group">
        <input
          className="input"
          type="text"
          placeholder="Enter File ID..."
          value={fileId}
          onChange={(e) => setFileId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          className={`btn btn-primary ${loading ? 'btn--loading' : ''}`}
          onClick={handleSearch}
          disabled={loading || !fileId.trim()}
        >
          {loading ? <span className="spinner" /> : 'Search'}
        </button>
      </div>

      {error && <p className="error-msg">⚠ {error}</p>}

      {/* Result */}
      {result && (
        <div className="result-box animate-in">
          <div className="success-badge">
            <span className="check">✓</span>
            File Found
          </div>

          <div className="result-field">
            <span className="field-label">File ID</span>
            <span className="field-value field-value--mono">{result.fileId}</span>
          </div>

          <div className="result-field">
            <span className="field-label">Created At</span>
            <span className="field-value">{formatDate(result.createdAt)}</span>
          </div>

          <div className="result-field">
            <span className="field-label">Download Link</span>
          </div>

          <div className="link-group">
            <input
              className="input input--readonly"
              type="text"
              value={result.url}
              readOnly
            />
            <button className={`btn btn-copy ${copied ? 'btn-copy--done' : ''}`} onClick={handleCopy}>
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>

          <a
            className="btn btn-primary btn-full"
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Download File
          </a>
        </div>
      )}

      {!result && !error && (
        <p className="footer-note">Enter a File ID to retrieve its details</p>
      )}
    </div>
  );
}
