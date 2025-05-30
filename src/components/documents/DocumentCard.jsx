import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { FaFilePdf, FaFileWord, FaFileAlt, FaFileImage, FaFileExcel, FaFilePowerpoint, FaFile, FaMarkdown } from 'react-icons/fa';
import { formatDate } from '../../utils/formatUtils';
import { getFileIcon } from '../../utils/fileUtils';

/**
 * DocumentCard component displays a single document in a card format
 */
const DocumentCard = ({ document, onClick }) => {
  // Get the appropriate icon based on file type
  const renderIcon = () => {
    const iconName = getFileIcon(document.fileType);
    const iconProps = { size: 40, className: 'mb-3 text-primary' };
    
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
  const getBadgeVariant = () => {
    const type = document.fileType.toLowerCase();
    
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

  return (
    <Card 
      className="h-100 shadow-sm document-card" 
      onClick={() => onClick && onClick(document)}
      style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
    >
      <Card.Body className="d-flex flex-column align-items-center text-center p-4">
        {renderIcon()}
        
        <Card.Title className="mb-1 text-truncate w-100">
          {document.title}
        </Card.Title>
        
        <Card.Subtitle className="mb-3 text-muted small">
          {formatDate(document.uploadDate, { relative: true })}
        </Card.Subtitle>
        
        <Badge 
          bg={getBadgeVariant()} 
          className="text-uppercase mt-auto"
        >
          {document.fileType}
        </Badge>
      </Card.Body>
    </Card>
  );
};

export default DocumentCard;
