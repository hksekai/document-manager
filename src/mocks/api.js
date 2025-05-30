import mockDocuments from './documents';

/**
 * Mock API service to simulate backend API calls
 */
const mockApi = {
  /**
   * Get all documents
   * @param {Object} options - Query options
   * @param {string} options.sort - Sort field
   * @param {string} options.filter - Filter criteria
   * @param {number} options.page - Page number
   * @param {number} options.limit - Items per page
   * @returns {Promise} Promise that resolves to documents array
   */
  getDocuments: (options = {}) => {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        let result = [...mockDocuments];
        
        // Apply filtering if provided
        if (options.filter) {
          result = result.filter(doc => 
            doc.title.toLowerCase().includes(options.filter.toLowerCase()) ||
            doc.fileType.toLowerCase() === options.filter.toLowerCase()
          );
        }
        
        // Apply sorting if provided
        if (options.sort) {
          const [field, direction] = options.sort.split(':');
          result.sort((a, b) => {
            if (direction === 'desc') {
              return a[field] < b[field] ? 1 : -1;
            }
            return a[field] > b[field] ? 1 : -1;
          });
        } else {
          // Default sort by uploadDate (newest first)
          result.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
        }
        
        // Apply pagination if provided
        if (options.page && options.limit) {
          const start = (options.page - 1) * options.limit;
          const end = start + options.limit;
          result = result.slice(start, end);
        }
        
        resolve({
          documents: result,
          total: mockDocuments.length,
          page: options.page || 1,
          limit: options.limit || result.length
        });
      }, 500);
    });
  },
  
  /**
   * Get a single document by ID
   * @param {string} id - Document ID
   * @returns {Promise} Promise that resolves to document object
   */
  getDocument: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const document = mockDocuments.find(doc => doc.id === id);
        if (document) {
          resolve(document);
        } else {
          reject(new Error('Document not found'));
        }
      }, 300);
    });
  },
  
  /**
   * Upload a new document
   * @param {File} file - File object
   * @returns {Promise} Promise that resolves to new document object
   */
  uploadDocument: (file) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Create mock document from file
        const newDoc = {
          id: `doc${Date.now()}`,
          title: file.name.split('.')[0],
          uploadDate: new Date().toISOString().split('T')[0],
          fileType: file.name.split('.').pop(),
          content: "Mock content for uploaded document",
          thumbnail: null,
          sourceType: "upload",
        };
        
        // Add to mock documents (in a real app, this would be a server-side operation)
        mockDocuments.push(newDoc);
        
        resolve(newDoc);
      }, 1000);
    });
  },
  
  /**
   * Delete a document
   * @param {string} id - Document ID
   * @returns {Promise} Promise that resolves when document is deleted
   */
  deleteDocument: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockDocuments.findIndex(doc => doc.id === id);
        if (index !== -1) {
          mockDocuments.splice(index, 1);
          resolve({ success: true });
        } else {
          reject(new Error('Document not found'));
        }
      }, 300);
    });
  },
  
  /**
   * Generate AI summary for a document
   * @param {string} id - Document ID
   * @param {Object} options - Summary options
   * @param {string} options.length - Summary length (short, medium, long)
   * @returns {Promise} Promise that resolves to summary text
   */
  generateSummary: (id, options = { length: 'medium' }) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const document = mockDocuments.find(doc => doc.id === id);
        if (!document) {
          reject(new Error('Document not found'));
          return;
        }
        
        // Generate mock summary based on length
        let summary;
        switch (options.length) {
          case 'short':
            summary = `This is a short AI-generated summary of "${document.title}". The document covers key concepts and ideas in a concise format.`;
            break;
          case 'long':
            summary = `This is a detailed AI-generated summary of "${document.title}". The document explores various aspects in depth, providing comprehensive coverage of the topic. It includes multiple examples, case studies, and practical applications. The content is structured to provide both theoretical background and practical implementation details.`;
            break;
          case 'medium':
          default:
            summary = `This is a medium-length AI-generated summary of "${document.title}". The document provides a balanced overview of the topic, covering main concepts and some supporting details. It offers enough context to understand the subject matter without overwhelming the reader with excessive information.`;
        }
        
        resolve({ summary });
      }, 1500);
    });
  },
  
  /**
   * Generate study guide from document
   * @param {string} id - Document ID
   * @param {Object} options - Study guide options
   * @param {string} options.format - Guide format (notes, flashcards, quiz)
   * @returns {Promise} Promise that resolves to study guide content
   */
  generateStudyGuide: (id, options = { format: 'notes' }) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const document = mockDocuments.find(doc => doc.id === id);
        if (!document) {
          reject(new Error('Document not found'));
          return;
        }
        
        // Generate mock study guide based on format
        let content;
        switch (options.format) {
          case 'flashcards':
            content = [
              { front: 'Key concept 1', back: 'Definition of concept 1' },
              { front: 'Key concept 2', back: 'Definition of concept 2' },
              { front: 'Key concept 3', back: 'Definition of concept 3' },
            ];
            break;
          case 'quiz':
            content = [
              { 
                question: 'What is the main topic of this document?', 
                options: ['Option A', 'Option B', 'Option C', 'Option D'],
                answer: 0
              },
              { 
                question: 'Which of the following is NOT discussed in the document?', 
                options: ['Topic 1', 'Topic 2', 'Topic 3', 'Topic 4'],
                answer: 3
              },
            ];
            break;
          case 'notes':
          default:
            content = `
# Study Notes: ${document.title}

## Main Concepts
- Key point 1 about the document
- Key point 2 about the document
- Key point 3 about the document

## Important Details
- Supporting detail 1
- Supporting detail 2
- Supporting detail 3

## Summary
Brief overview of the document's main points and conclusions.
            `;
        }
        
        resolve({ content });
      }, 2000);
    });
  },
  
  /**
   * Get available TTS voices
   * @returns {Promise} Promise that resolves to array of voice objects
   */
  getTtsVoices: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          voices: [
            { id: 'voice1', name: 'Emma (Female)', language: 'en-US' },
            { id: 'voice2', name: 'Michael (Male)', language: 'en-US' },
            { id: 'voice3', name: 'Sophie (Female)', language: 'en-GB' },
            { id: 'voice4', name: 'James (Male)', language: 'en-GB' },
          ]
        });
      }, 300);
    });
  },
  
  /**
   * Generate TTS audio for text
   * @param {Object} options - TTS options
   * @param {string} options.text - Text to convert to speech
   * @param {string} options.voiceId - Voice ID to use
   * @param {number} options.speed - Speech speed (0.5 to 2.0)
   * @returns {Promise} Promise that resolves to audio URL
   */
  generateTtsAudio: (options) => {
    return new Promise((resolve, reject) => {
      if (!options.text) {
        reject(new Error('Text is required'));
        return;
      }
      
      setTimeout(() => {
        // In a real app, this would return an audio URL
        // For mock purposes, we'll just return a success message
        resolve({
          success: true,
          message: `TTS audio would be generated for text: "${options.text.substring(0, 50)}..." using voice ${options.voiceId || 'default'} at speed ${options.speed || 1.0}`,
          // In a real implementation, this would be a URL to an audio file
          audioUrl: 'mock-audio-url.mp3'
        });
      }, 1000);
    });
  }
};

export default mockApi;
