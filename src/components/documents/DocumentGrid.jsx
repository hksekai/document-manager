import React from 'react';
import { Row, Col, Alert, Spinner, Button } from 'react-bootstrap';
import { FaFileAlt, FaUpload } from 'react-icons/fa';
import DocumentCard from './DocumentCard';
import useDocuments from '../../hooks/useDocuments';

/**
 * DocumentGrid component displays a grid of document cards
 */
const DocumentGrid = ({ onDocumentClick }) => {
  const { documents, loading, error } = useDocuments();

  // Show loading spinner
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3 text-muted">Loading documents...</p>
      </div>
    );
  }

  // Show error message
  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Error Loading Documents</Alert.Heading>
        <p>{error}</p>
      </Alert>
    );
  }

  // Show empty state
  if (!documents || documents.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="mb-4">
          <FaFileAlt size={80} className="empty-state-icon" />
        </div>
        <h4 className="mb-3">No Documents Found</h4>
        <p className="text-muted mb-4">
          Upload your first document to get started with NotebookLM.
        </p>
        <Button variant="primary" onClick={() => document.querySelector('.btn-primary[size="lg"]').click()}>
          <FaUpload className="me-2" />
          Upload Document
        </Button>
      </div>
    );
  }

  // Render document grid
  return (
    <Row xs={1} sm={2} md={3} lg={4} xl={5} className="g-4 mb-4">
      {documents.map((document) => (
        <Col key={document.id}>
          <DocumentCard 
            document={document} 
            onClick={onDocumentClick}
          />
        </Col>
      ))}
    </Row>
  );
};

export default DocumentGrid;
