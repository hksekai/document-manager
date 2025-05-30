/**
 * Utility functions for file operations
 */

/**
 * Get file extension from filename
 * @param {string} filename - The filename
 * @returns {string} The file extension (lowercase)
 */
export const getFileExtension = (filename) => {
  if (!filename) return '';
  return filename.split('.').pop().toLowerCase();
};

/**
 * Get file type category based on extension
 * @param {string} extension - The file extension
 * @returns {string} The file type category (document, image, etc.)
 */
export const getFileTypeCategory = (extension) => {
  const documentTypes = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'md', 'odt'];
  const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'];
  const spreadsheetTypes = ['xls', 'xlsx', 'csv', 'ods'];
  const presentationTypes = ['ppt', 'pptx', 'odp'];
  
  if (documentTypes.includes(extension)) return 'document';
  if (imageTypes.includes(extension)) return 'image';
  if (spreadsheetTypes.includes(extension)) return 'spreadsheet';
  if (presentationTypes.includes(extension)) return 'presentation';
  
  return 'other';
};

/**
 * Get icon name for file type
 * @param {string} fileType - The file type or extension
 * @returns {string} The icon name to use with react-icons
 */
export const getFileIcon = (fileType) => {
  const type = fileType.toLowerCase();
  
  switch (type) {
    case 'pdf':
      return 'FaFilePdf';
    case 'doc':
    case 'docx':
    case 'odt':
      return 'FaFileWord';
    case 'txt':
    case 'rtf':
      return 'FaFileAlt';
    case 'md':
      return 'FaMarkdown';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'bmp':
    case 'svg':
      return 'FaFileImage';
    case 'xls':
    case 'xlsx':
    case 'csv':
    case 'ods':
      return 'FaFileExcel';
    case 'ppt':
    case 'pptx':
    case 'odp':
      return 'FaFilePowerpoint';
    default:
      return 'FaFile';
  }
};

/**
 * Format file size in human-readable format
 * @param {number} bytes - The file size in bytes
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Check if file type is supported for viewing
 * @param {string} fileType - The file type or extension
 * @returns {boolean} Whether the file type is supported
 */
export const isSupportedFileType = (fileType) => {
  const supportedTypes = [
    'pdf', 'doc', 'docx', 'txt', 'rtf', 'md',
    'jpg', 'jpeg', 'png', 'gif', 'bmp',
    'csv'
  ];
  
  return supportedTypes.includes(fileType.toLowerCase());
};

/**
 * Get viewer component name for file type
 * @param {string} fileType - The file type or extension
 * @returns {string} The viewer component name
 */
export const getViewerForFileType = (fileType) => {
  const type = fileType.toLowerCase();
  
  switch (type) {
    case 'pdf':
      return 'PDFViewer';
    case 'doc':
    case 'docx':
      return 'DocxViewer';
    case 'txt':
    case 'rtf':
    case 'md':
      return 'TextViewer';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'bmp':
      return 'ImageViewer';
    case 'csv':
      return 'CSVViewer';
    default:
      return 'UnsupportedViewer';
  }
};

/**
 * Check if file content can be read as text for TTS
 * @param {string} fileType - The file type or extension
 * @returns {boolean} Whether the file content can be read as text
 */
export const canReadAsText = (fileType) => {
  const textReadableTypes = [
    'pdf', 'doc', 'docx', 'txt', 'rtf', 'md', 'csv'
  ];
  
  return textReadableTypes.includes(fileType.toLowerCase());
};
