import React from 'react';
import { useTTS } from '../../context/TTSContext';

/**
 * TTSHighlighter component
 * Displays document content with the current sentence highlighted
 * Allows clicking on sentences to skip to that part of the speech
 */
const TTSHighlighter = ({ content }) => {
  const { sentences, currentSentenceIndex, skipToSentence, parseContent } = useTTS();
  
  // Parse content into sentences if not already done
  React.useEffect(() => {
    if (content && (!sentences || sentences.length === 0)) {
      parseContent(content);
    }
  }, [content, sentences, parseContent]);
  
  // If no sentences, just return the content
  if (!sentences || sentences.length === 0) {
    return <div className="document-text">{content}</div>;
  }
  
  return (
    <div className="tts-highlighter">
      {sentences.map((sentence, index) => (
        <span 
          key={index}
          className={`sentence ${index === currentSentenceIndex ? 'highlight' : ''}`}
          onClick={() => skipToSentence(index)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              skipToSentence(index);
            }
          }}
          aria-current={index === currentSentenceIndex}
          aria-label={`Sentence ${index + 1} of ${sentences.length}`}
        >
          {sentence}{' '}
        </span>
      ))}
    </div>
  );
};

export default TTSHighlighter;
