import React, { createContext, useState, useRef, useCallback, useEffect } from 'react';
import mockApi from '../mocks/api';

// Check if the Web Speech API is available
const isSpeechSynthesisSupported = 'speechSynthesis' in window;

/**
 * Context for Text-to-Speech functionality
 * Manages TTS state and provides methods for controlling playback
 */
export const TTSContext = createContext();

/**
 * Helper function to split text into sentences
 * @param {string} text - The text to split into sentences
 * @returns {Array} Array of sentences
 */
const splitIntoSentences = (text) => {
  if (!text) return [];
  
  // Split text by common sentence terminators (., !, ?)
  // This is a simple implementation and might need refinement for edge cases
  const sentenceRegex = /[^.!?]+[.!?]+/g;
  const sentences = text.match(sentenceRegex) || [];
  
  // Trim whitespace from each sentence
  return sentences.map(sentence => sentence.trim());
};

/**
 * TTSProvider component
 * Provides TTS context to child components
 */
export const TTSProvider = ({ children, documentContent }) => {
  // State for TTS functionality
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [sentences, setSentences] = useState([]);
  const [speed, setSpeed] = useState(1.0);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [availableBrowserVoices, setAvailableBrowserVoices] = useState([]);
  
  // Refs
  const utteranceRef = useRef(null);
  const synth = useRef(isSpeechSynthesisSupported ? window.speechSynthesis : null);
  
  // Parse document content into sentences
  const parseContent = useCallback((content) => {
    if (!content) return;
    
    const parsedSentences = splitIntoSentences(content);
    setSentences(parsedSentences);
    setCurrentSentenceIndex(0);
  }, []);
  
  // Load available voices from Web Speech API
  useEffect(() => {
    if (!isSpeechSynthesisSupported) {
      // Fallback to mock voices if Web Speech API is not supported
      const loadMockVoices = async () => {
        try {
          const response = await mockApi.getTtsVoices();
          setVoices(response.voices);
          
          // Set default voice
          if (response.voices.length > 0) {
            setSelectedVoice(response.voices[0]);
          }
        } catch (error) {
          console.error('Failed to load TTS voices:', error);
        }
      };
      
      loadMockVoices();
      return;
    }
    
    // Function to load and set voices
    const loadVoices = () => {
      const browserVoices = synth.current.getVoices();
      setAvailableBrowserVoices(browserVoices);
      
      // Map browser voices to our format
      const mappedVoices = browserVoices.map((voice, index) => ({
        id: `voice-${index}`,
        name: voice.name,
        language: voice.lang
      }));
      
      setVoices(mappedVoices);
      
      // Set default voice (prefer English voices)
      if (mappedVoices.length > 0) {
        const englishVoice = mappedVoices.find(v => v.language.startsWith('en'));
        setSelectedVoice(englishVoice || mappedVoices[0]);
      }
    };
    
    // Chrome loads voices asynchronously
    if (synth.current.onvoiceschanged !== undefined) {
      synth.current.onvoiceschanged = loadVoices;
    }
    
    // Initial load attempt (works in Firefox)
    loadVoices();
    
    // Cleanup
    return () => {
      if (synth.current && synth.current.onvoiceschanged !== undefined) {
        synth.current.onvoiceschanged = null;
      }
    };
  }, []);
  
  // Parse document content when it changes
  useEffect(() => {
    if (documentContent) {
      parseContent(documentContent);
    }
  }, [documentContent, parseContent]);
  
  // Play the current sentence using Web Speech API
  const play = useCallback(() => {
    if (sentences.length === 0 || currentSentenceIndex >= sentences.length) {
      return;
    }
    
    // If Web Speech API is not supported, use mock implementation
    if (!isSpeechSynthesisSupported) {
      setIsPlaying(true);
      
      // Simulate audio playback completion after a delay based on sentence length and speed
      const sentenceLength = sentences[currentSentenceIndex].length;
      const playbackDuration = (sentenceLength * 50) / speed; // Rough estimate: 50ms per character
      
      setTimeout(() => {
        // Move to the next sentence when audio completes
        if (currentSentenceIndex < sentences.length - 1) {
          setCurrentSentenceIndex(prevIndex => prevIndex + 1);
        } else {
          // End of document
          setIsPlaying(false);
        }
      }, playbackDuration);
      
      return;
    }
    
    try {
      // Cancel any ongoing speech
      synth.current.cancel();
      
      // Create a new utterance
      utteranceRef.current = new SpeechSynthesisUtterance(sentences[currentSentenceIndex]);
      
      // Set voice if selected
      if (selectedVoice && availableBrowserVoices.length > 0) {
        const voiceIndex = parseInt(selectedVoice.id.split('-')[1], 10);
        if (!isNaN(voiceIndex) && voiceIndex < availableBrowserVoices.length) {
          utteranceRef.current.voice = availableBrowserVoices[voiceIndex];
        }
      }
      
      // Set rate (speed)
      utteranceRef.current.rate = speed;
      
      // Set event handlers
      utteranceRef.current.onend = () => {
        // Move to the next sentence when audio completes
        if (currentSentenceIndex < sentences.length - 1) {
          setCurrentSentenceIndex(prevIndex => prevIndex + 1);
          setTimeout(() => play(), 0);
        } else {
          // End of document
          setIsPlaying(false);
        }
      };
      
      utteranceRef.current.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsPlaying(false);
      };
      
      // Start speaking
      synth.current.speak(utteranceRef.current);
      setIsPlaying(true);
    } catch (error) {
      console.error('Failed to play TTS audio:', error);
      setIsPlaying(false);
    }
  }, [sentences, currentSentenceIndex, selectedVoice, availableBrowserVoices, speed, isSpeechSynthesisSupported]);
  
  // Pause playback
  const pause = useCallback(() => {
    if (isSpeechSynthesisSupported) {
      synth.current.pause();
    }
    setIsPlaying(false);
  }, [isSpeechSynthesisSupported]);
  
  // Stop playback
  const stop = useCallback(() => {
    if (isSpeechSynthesisSupported) {
      synth.current.cancel();
    }
    setIsPlaying(false);
  }, [isSpeechSynthesisSupported]);
  
  // Skip to a specific sentence
  const skipToSentence = useCallback((index) => {
    if (index >= 0 && index < sentences.length) {
      // Stop current playback
      if (isSpeechSynthesisSupported) {
        synth.current.cancel();
      }
      
      setCurrentSentenceIndex(index);
      
      // If currently playing, start playing the new sentence
      if (isPlaying) {
        setIsPlaying(false);
        setTimeout(() => play(), 0);
      }
    }
  }, [sentences, isPlaying, play, isSpeechSynthesisSupported]);
  
  // Go to the next sentence
  const nextSentence = useCallback(() => {
    skipToSentence(currentSentenceIndex + 1);
  }, [currentSentenceIndex, skipToSentence]);
  
  // Go to the previous sentence
  const previousSentence = useCallback(() => {
    skipToSentence(currentSentenceIndex - 1);
  }, [currentSentenceIndex, skipToSentence]);
  
  // Change playback speed
  const changeSpeed = useCallback((newSpeed) => {
    setSpeed(newSpeed);
    
    // If currently playing, restart with new speed
    if (isPlaying) {
      // Stop current playback
      if (isSpeechSynthesisSupported) {
        synth.current.cancel();
      }
      
      setIsPlaying(false);
      setTimeout(() => play(), 0);
    }
  }, [isPlaying, play, isSpeechSynthesisSupported]);
  
  // Context value
  const value = {
    isPlaying,
    currentSentenceIndex,
    sentences,
    speed,
    voices,
    selectedVoice,
    play,
    pause,
    stop,
    skipToSentence,
    nextSentence,
    previousSentence,
    changeSpeed,
    parseContent,
    setSelectedVoice,
    isSpeechSynthesisSupported
  };
  
  return (
    <TTSContext.Provider value={value}>
      {children}
    </TTSContext.Provider>
  );
};

/**
 * Custom hook to access the TTS context
 * @returns {Object} TTS context value
 */
export const useTTS = () => {
  const context = React.useContext(TTSContext);
  
  if (!context) {
    throw new Error('useTTS must be used within a TTSProvider');
  }
  
  return context;
};

export default TTSProvider;
