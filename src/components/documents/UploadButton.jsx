import React, { useRef, useState } from 'react';
import { Button, Modal, Form, ProgressBar, Alert } from 'react-bootstrap';
import { FaUpload, FaFileUpload } from 'react-icons/fa';
import useDocuments from '../../hooks/useDocuments';

/**
 * UploadButton component for uploading new documents
 */
const UploadButton = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  
  const { uploadDocument } = useDocuments();

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFile(null);
    setUploadProgress(0);
    setUploading(false);
    setError(null);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError(null);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 200);

    try {
      await uploadDocument(selectedFile);
      setUploadProgress(100);
      
      // Close modal after a short delay
      setTimeout(() => {
        handleCloseModal();
      }, 1000);
    } catch (err) {
      setError('Failed to upload document. Please try again.');
      console.error(err);
    } finally {
      clearInterval(progressInterval);
      setUploading(false);
    }
  };

  return (
    <>
      <Button 
        variant="primary" 
        size="lg" 
        className="d-flex align-items-center shadow"
        onClick={handleShowModal}
      >
        <FaUpload className="me-2" />
        <span>Create new</span>
      </Button>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Upload Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <Alert variant="danger">{error}</Alert>
          )}
          
          <div 
            className="upload-area border rounded p-5 mb-3 text-center"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
            style={{ 
              cursor: 'pointer',
              backgroundColor: '#f8f9fa',
              borderStyle: 'dashed'
            }}
          >
            <FaFileUpload size={48} className="mb-3 text-primary" />
            <h5>Drag & Drop or Click to Upload</h5>
            <p className="text-muted mb-0">
              Supported formats: PDF, DOCX, TXT, MD, and more
            </p>
            
            <Form.Control
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
              accept=".pdf,.doc,.docx,.txt,.rtf,.md,.csv"
            />
          </div>
          
          {selectedFile && (
            <div className="selected-file mb-3">
              <p className="mb-1">
                <strong>Selected File:</strong> {selectedFile.name}
              </p>
              <p className="text-muted mb-0">
                Size: {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}
          
          {uploading && (
            <div className="mt-3">
              <ProgressBar 
                now={uploadProgress} 
                label={`${Math.round(uploadProgress)}%`} 
                animated
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal} disabled={uploading}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleUpload} 
            disabled={!selectedFile || uploading}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UploadButton;
