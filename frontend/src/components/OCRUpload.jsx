import React, { useState, useRef, useCallback } from "react";
import axios from "axios";
import { 
  Copy, 
  Download, 
  UploadCloud, 
  Loader2, 
  CheckCircle2, 
  XCircle,
  Image as ImageIcon 
} from "lucide-react";
import "./OCRUpload.css";

function OCRUpload() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [text, setText] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle");
  const [dragActive, setDragActive] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = useCallback((selectedFile) => {
    if (selectedFile?.type.startsWith('image/')) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setStatus("ready");
      setText([]);
    }
  }, []);

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setStatus("processing");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/extract/",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setText(response.data.text || []);
      setStatus("success");
    } catch (err) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const content = text.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `extracted-text-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setFile(null);
    setPreviewUrl("");
    setText([]);
    setStatus("idle");
    setCopied(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, [handleFileSelect]);

  return (
    <div className="app-container">
      {/* Professional Navigation */}
      <nav className="navbar">
        <div className="nav-brand">
          <ImageIcon size={28} />
          <span>TextScan Pro</span>
        </div>
      </nav>

      <div className="main-content">
        {/* Hero Section */}
        <header className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Extract Text Instantly</h1>
            <p className="hero-subtitle">
              Upload any image and get clean, accurate text extraction powered by AI
            </p>
          </div>
        </header>

        <div className="content-wrapper">
          {/* Upload Area */}
          <section className="upload-section">
            <div 
              className={`upload-area ${dragActive ? 'drag-active' : ''} ${status}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="file-preview">
                  <div className="preview-container">
                    <img src={previewUrl} alt="Preview" className="preview-image" />
                  </div>
                  <div className="file-details">
                    <div className="filename">{file.name}</div>
                    <div className="file-meta">
                      <span>{(file.size / 1024).toFixed(1)} KB</span>
                      <span>{file.type.split('/')[1]?.toUpperCase()}</span>
                    </div>
                  </div>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Change File
                  </button>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <UploadCloud size={64} />
                  <h2>Drop your image here, or click to browse</h2>
                  <p>Supports JPG, PNG, GIF. Maximum 10MB</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose Image
                  </button>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                className="file-input"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(e.target.files?.[0])}
              />
            </div>

            {status === "ready" && (
              <div className="action-buttons">
                <button 
                  className="btn btn-primary btn-large"
                  onClick={handleUpload}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="loading-icon" size={20} />
                      Processing...
                    </>
                  ) : (
                    'Extract Text'
                  )}
                </button>
                <button className="btn btn-outline" onClick={clearAll}>
                  Cancel
                </button>
              </div>
            )}
          </section>

          {/* Results Section */}
          {status === "processing" && (
            <section className="results-section">
              <div className="section-header">
                <div className="status-indicator">
                  <Loader2 className="loading-icon" size={24} />
                  <span>Analyzing your image...</span>
                </div>
              </div>
              <div className="skeleton-loader">
                <div className="skeleton-line long" />
                <div className="skeleton-line medium" />
                <div className="skeleton-line long" />
                <div className="skeleton-line short" />
              </div>
            </section>
          )}

          {status === "success" && text.length > 0 && (
            <section className="results-section">
              <div className="section-header">
                <div className="status-indicator success">
                  <CheckCircle2 size={24} />
                  <span>Successfully extracted {text.length} lines</span>
                </div>
                <div className="action-group">
                  <button 
                    className={`btn btn-icon ${copied ? 'copied' : ''}`}
                    onClick={handleCopy}
                    title="Copy to clipboard"
                  >
                    {copied ? '✓' : <Copy size={18} />}
                  </button>
                  <button 
                    className="btn btn-icon"
                    onClick={handleDownload}
                    title="Download as TXT"
                  >
                    <Download size={18} />
                  </button>
                </div>
              </div>
              <div className="results-content">
                <pre className="extracted-text">{text.join('\n')}</pre>
              </div>
            </section>
          )}

          {status === "error" && (
            <section className="error-section">
              <div className="error-content">
                <XCircle size={48} />
                <h3>Extraction failed</h3>
                <p>Please try with a different image or check your connection</p>
                <button className="btn btn-primary" onClick={clearAll}>
                  Try Again
                </button>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2026 TextScan Pro. Powered by AI OCR Technology</p>
      </footer>
    </div>
  );
}

export default OCRUpload;
