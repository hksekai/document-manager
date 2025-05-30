import React, { useState, useCallback } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Layout from './components/layout/Layout';
import DocumentGrid from './components/documents/DocumentGrid';
import DocumentViewer from './components/documents/DocumentViewer';
import UploadButton from './components/documents/UploadButton';
import { DocumentProvider } from './context/DocumentContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

/**
 * Main App component
 */
function App() {
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle document selection
  const handleDocumentClick = useCallback((document) => {
    setSelectedDocumentId(document.id);
  }, []);

  // Handle back button click in document viewer
  const handleBackClick = useCallback(() => {
    setSelectedDocumentId(null);
  }, []);

  // Handle search
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  return (
    <DocumentProvider>
      <Layout onSearch={handleSearch}>
        <Container fluid>
          {selectedDocumentId ? (
            // Document viewer view
            <DocumentViewer 
              documentId={selectedDocumentId} 
              onBack={handleBackClick} 
            />
          ) : (
            // Documents grid view
            <>
              <Row className="mb-4 align-items-center">
                <Col>
                  <h1 className="mb-0">Welcome to NotebookLM</h1>
                </Col>
                <Col xs="auto">
                  <UploadButton />
                </Col>
              </Row>
              
              {searchQuery && (
                <div className="mb-4">
                  <h5>Search results for: "{searchQuery}"</h5>
                </div>
              )}
              
              <DocumentGrid onDocumentClick={handleDocumentClick} />
            </>
          )}
        </Container>
      </Layout>
    </DocumentProvider>
  );
}

export default App;
