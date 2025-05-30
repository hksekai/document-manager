import React, { useState, useEffect } from 'react';
import { Card, Button, Spinner, Alert, Row, Col, Badge } from 'react-bootstrap';
import { FaArrowLeft, FaFilePdf, FaFileWord, FaFileAlt, FaFileImage, FaFileExcel, FaFilePowerpoint, FaFile, FaMarkdown, FaBell, FaRobot } from 'react-icons/fa';
import { formatDate } from '../../utils/formatUtils';
import { getFileIcon } from '../../utils/fileUtils';
import useDocuments from '../../hooks/useDocuments';
import TTSProvider from '../../context/TTSContext';
import TTSPlayer from '../tts/TTSPlayer';
import TTSHighlighter from '../tts/TTSHighlighter';

/**
 * DocumentViewer component for displaying document content
 */
const DocumentViewer = ({ documentId, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fetchDocument } = useDocuments();
  const [document, setDocument] = useState(null);

  useEffect(() => {
    const loadDocument = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const doc = await fetchDocument(documentId);
        setDocument(doc);
      } catch (err) {
        setError('Failed to load document. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (documentId) {
      loadDocument();
    }
  }, [documentId, fetchDocument]);

  // Get the appropriate icon based on file type
  const renderIcon = (fileType) => {
    const iconName = getFileIcon(fileType);
    const iconProps = { size: 24, className: 'me-2' };
    
    switch (iconName) {
      case 'FaFilePdf':
        return <FaFilePdf {...iconProps} />;
      case 'FaFileWord':
        return <FaFileWord {...iconProps} />;
      case 'FaFileAlt':
        return <FaFileAlt {...iconProps} />;
      case 'FaMarkdown':
        return <FaMarkdown {...iconProps} />;
      case 'FaFileImage':
        return <FaFileImage {...iconProps} />;
      case 'FaFileExcel':
        return <FaFileExcel {...iconProps} />;
      case 'FaFilePowerpoint':
        return <FaFilePowerpoint {...iconProps} />;
      default:
        return <FaFile {...iconProps} />;
    }
  };

  // Get badge color based on file type
  const getBadgeVariant = (fileType) => {
    const type = fileType.toLowerCase();
    
    switch (type) {
      case 'pdf':
        return 'danger';
      case 'doc':
      case 'docx':
        return 'primary';
      case 'txt':
      case 'rtf':
        return 'secondary';
      case 'md':
        return 'info';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'success';
      case 'xls':
      case 'xlsx':
      case 'csv':
        return 'success';
      case 'ppt':
      case 'pptx':
        return 'warning';
      default:
        return 'dark';
    }
  };

  // Show loading spinner
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3 text-muted">Loading document...</p>
      </div>
    );
  }

  // Show error message
  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Error Loading Document</Alert.Heading>
        <p>{error}</p>
        <div className="d-flex justify-content-end">
          <Button variant="outline-danger" onClick={onBack}>
            Go Back
          </Button>
        </div>
      </Alert>
    );
  }

  // Show document not found
  if (!document) {
    return (
      <Alert variant="warning">
        <Alert.Heading>Document Not Found</Alert.Heading>
        <p>The requested document could not be found.</p>
        <div className="d-flex justify-content-end">
          <Button variant="outline-warning" onClick={onBack}>
            Go Back
          </Button>
        </div>
      </Alert>
    );
  }

  return (
    <div className="document-viewer">
      <div className="mb-4">
        <Button 
          variant="outline-secondary" 
          onClick={onBack}
          className="d-flex align-items-center"
        >
          <FaArrowLeft className="me-2" />
          <span>Back to Documents</span>
        </Button>
      </div>
      
      <Card className="mb-4">
        <Card.Header>
          <Row className="align-items-center">
            <Col>
              <div className="d-flex align-items-center">
                {renderIcon(document.fileType)}
                <h4 className="mb-0">{document.title}</h4>
              </div>
            </Col>
            <Col xs="auto">
              <Badge 
                bg={getBadgeVariant(document.fileType)} 
                className="text-uppercase"
              >
                {document.fileType}
              </Badge>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <div className="mb-3 text-muted small">
            Uploaded on {formatDate(document.uploadDate)}
          </div>
          
          {/* Wrap both document content and TTS player in a single TTSProvider */}
          <TTSProvider documentContent={document.content}>
            <div className="document-content mb-4">
              <TTSHighlighter content={document.content} />
            </div>
            
            {/* TTS Player */}
            <Card className="mb-3">
              <Card.Header className="d-flex align-items-center">
                <FaBell className="me-2 text-primary" />
                <h5 className="mb-0">Text to Speech</h5>
              </Card.Header>
              <Card.Body>
                <TTSPlayer />
              </Card.Body>
            </Card>
          </TTSProvider>
        </Card.Body>
      </Card>
      
      {/* AI features */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header className="d-flex align-items-center">
              <FaRobot className="me-2 text-primary" />
              <h5 className="mb-0">AI Summary & Study Guide</h5>
            </Card.Header>
            <Card.Body className="text-center py-5">
              <p className="text-muted">
                AI summary and study guide generation will be implemented here.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DocumentViewer;
