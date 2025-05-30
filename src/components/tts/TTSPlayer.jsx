import React from 'react';
import { Card, Button, Form, Badge } from 'react-bootstrap';
import { FaPlay, FaPause, FaForward, FaBackward, FaStop } from 'react-icons/fa';
import { useTTS } from '../../context/TTSContext';

/**
 * TTSPlayer component
 * Provides controls for text-to-speech playback
 */
const TTSPlayer = () => {
  const {
    isPlaying,
    play,
    pause,
    stop,
    nextSentence,
    previousSentence,
    speed,
    changeSpeed,
    voices,
    selectedVoice,
    setSelectedVoice,
    sentences,
    currentSentenceIndex,
    isSpeechSynthesisSupported
  } = useTTS();

  // Calculate progress percentage
  const progressPercentage = sentences.length > 0 
    ? ((currentSentenceIndex + 1) / sentences.length) * 100 
    : 0;

  return (
    <div className="tts-player">
      {/* Progress bar */}
      <div className="progress mb-3">
        <div 
          className="progress-bar" 
          role="progressbar" 
          style={{ width: `${progressPercentage}%` }} 
          aria-valuenow={progressPercentage} 
          aria-valuemin="0" 
          aria-valuemax="100"
        >
          {sentences.length > 0 && `${currentSentenceIndex + 1} / ${sentences.length}`}
        </div>
      </div>
      
      {/* Speech API support indicator */}
      {!isSpeechSynthesisSupported && (
        <div className="mb-3">
          <Badge bg="warning" className="p-2">
            Web Speech API not supported in your browser. Using fallback mode.
          </Badge>
        </div>
      )}
      
      {/* Playback controls */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex">
          <Button 
            variant="outline-secondary" 
            onClick={previousSentence}
            disabled={currentSentenceIndex <= 0 || sentences.length === 0}
            aria-label="Previous sentence"
          >
            <FaBackward />
          </Button>
          <Button 
            variant="primary" 
            className="mx-2" 
            onClick={isPlaying ? pause : play}
            disabled={sentences.length === 0}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </Button>
          
          <Button 
            variant="outline-secondary" 
            className="me-2"
            onClick={stop}
            disabled={!isPlaying || sentences.length === 0}
            aria-label="Stop"
          >
            <FaStop />
          </Button>
          <Button 
            variant="outline-secondary" 
            onClick={nextSentence}
            disabled={currentSentenceIndex >= sentences.length - 1 || sentences.length === 0}
            aria-label="Next sentence"
          >
            <FaForward />
          </Button>
        </div>
        
        {/* Speed control */}
        <div className="d-flex align-items-center">
          <span className="me-2">Speed:</span>
          <Form.Select 
            value={speed} 
            onChange={(e) => changeSpeed(parseFloat(e.target.value))}
            style={{ width: '100px' }}
            aria-label="Playback speed"
          >
            <option value="0.5">0.5x</option>
            <option value="0.75">0.75x</option>
            <option value="1">1x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </Form.Select>
        </div>
        
        {/* Voice selection */}
        <div className="d-flex align-items-center">
          <span className="me-2">Voice:</span>
          <Form.Select 
            value={selectedVoice?.id || ''} 
            onChange={(e) => setSelectedVoice(voices.find(v => v.id === e.target.value))}
            style={{ width: '150px' }}
            aria-label="Voice selection"
          >
            {voices.map(voice => (
              <option key={voice.id} value={voice.id}>{voice.name}</option>
            ))}
          </Form.Select>
        </div>
      </div>
      
      {/* Current sentence display */}
      {sentences.length > 0 && (
        <div className="current-sentence p-2 border rounded bg-light">
          <p className="mb-0">
            <strong>Current sentence:</strong> {sentences[currentSentenceIndex]}
          </p>
        </div>
      )}
    </div>
  );
};

export default TTSPlayer;
