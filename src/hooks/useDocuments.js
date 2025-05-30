import { useContext } from 'react';
import { DocumentContext } from '../context/DocumentContext';

/**
 * Custom hook to access the document context
 * @returns {Object} Document context value
 */
const useDocuments = () => {
  const context = useContext(DocumentContext);
  
  if (!context) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  
  return context;
};

export default useDocuments;
