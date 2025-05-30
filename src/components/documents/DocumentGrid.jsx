import React from 'react';
import { Row, Col, Alert, Spinner } from 'react-bootstrap';
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
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#6c757d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 2V8H20" stroke="#6c757d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 18V12" stroke="#6c757d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 15H15" stroke="#6c757d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h4>No Documents Found</h4>
        <p className="text-muted">
          Upload your first document to get started.
        </p>
      </div>
    );
  }

  // Render document grid
  return (
    <Row xs={1} sm={2} md={3} lg={4} xl={5} className="g-4">
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
