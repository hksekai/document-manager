import React, { createContext, useState, useEffect, useCallback } from 'react';
import mockApi from '../mocks/api';

// Create the context
export const DocumentContext = createContext();

/**
 * Document context provider component
 * Manages document state and provides document-related functions
 */
export const DocumentProvider = ({ children }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [filters, setFilters] = useState({
    sort: null,
    filter: null,
    page: 1,
    limit: 10
  });

  // Fetch documents based on current filters
  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await mockApi.getDocuments(filters);
      setDocuments(response.documents);
    } catch (err) {
      setError('Failed to fetch documents. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch a single document by ID
  const fetchDocument = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const document = await mockApi.getDocument(id);
      setCurrentDocument(document);
      return document;
    } catch (err) {
      setError('Failed to fetch document. Please try again.');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Upload a new document
  const uploadDocument = useCallback(async (file) => {
    setLoading(true);
    setError(null);
    
    try {
      const newDocument = await mockApi.uploadDocument(file);
      setDocuments(prev => [newDocument, ...prev]);
      return newDocument;
    } catch (err) {
      setError('Failed to upload document. Please try again.');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a document
  const deleteDocument = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await mockApi.deleteDocument(id);
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      if (currentDocument && currentDocument.id === id) {
        setCurrentDocument(null);
      }
      return true;
    } catch (err) {
      setError('Failed to delete document. Please try again.');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentDocument]);

  // Generate AI summary for a document
  const generateSummary = useCallback(async (id, options) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await mockApi.generateSummary(id, options);
      return result.summary;
    } catch (err) {
      setError('Failed to generate summary. Please try again.');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Generate study guide from document
  const generateStudyGuide = useCallback(async (id, options) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await mockApi.generateStudyGuide(id, options);
      return result.content;
    } catch (err) {
      setError('Failed to generate study guide. Please try again.');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      // Reset page to 1 if filter or sort changes
      page: (newFilters.filter !== undefined || newFilters.sort !== undefined) ? 1 : prev.page
    }));
  }, []);

  // Load documents on initial render and when filters change
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Context value
  const value = {
    documents,
    loading,
    error,
    currentDocument,
    filters,
    fetchDocuments,
    fetchDocument,
    uploadDocument,
    deleteDocument,
    generateSummary,
    generateStudyGuide,
    updateFilters
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};

export default DocumentProvider;
