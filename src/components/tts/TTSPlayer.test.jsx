import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TTSPlayer from './TTSPlayer';
import TTSProvider from '../../context/TTSContext';
import mockApi from '../../mocks/api';

// Mock the Web Speech API
const mockSpeechSynthesis = {
  getVoices: jest.fn().mockReturnValue([
    { name: 'Test Voice 1', lang: 'en-US' },
    { name: 'Test Voice 2', lang: 'en-GB' }
  ]),
  speak: jest.fn(),
  cancel: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn(),
  onvoiceschanged: null
};

// Setup and cleanup for Web Speech API mocks
beforeAll(() => {
  // Mock the Web Speech API
  global.speechSynthesis = mockSpeechSynthesis;
  
  // Mock the 'in window' check
  Object.defineProperty(window, 'speechSynthesis', {
    value: mockSpeechSynthesis,
    writable: true
  });
});

afterAll(() => {
  // Clean up
  delete global.speechSynthesis;
  delete window.speechSynthesis;
});

// Mock the TTS context
jest.mock('../../context/TTSContext', () => {
  const originalModule = jest.requireActual('../../context/TTSContext');
  
  // Mock provider that injects our test values
  const MockProvider = ({ children }) => {
    return children;
  };
  
  return {
    __esModule: true,
    ...originalModule,
    default: MockProvider,
    useTTS: jest.fn()
  };
});

// Mock the mockApi
jest.mock('../../mocks/api', () => ({
  getTtsVoices: jest.fn().mockResolvedValue({
    voices: [
      { id: 'voice1', name: 'Test Voice 1', language: 'en-US' },
      { id: 'voice2', name: 'Test Voice 2', language: 'en-GB' }
    ]
  }),
  generateTtsAudio: jest.fn().mockResolvedValue({
    success: true,
    audioUrl: 'mock-audio-url.mp3'
  })
}));

describe('TTSPlayer', () => {
  const mockTTS = {
    isPlaying: false,
    play: jest.fn(),
    pause: jest.fn(),
    stop: jest.fn(),
    nextSentence: jest.fn(),
    previousSentence: jest.fn(),
    speed: 1,
    changeSpeed: jest.fn(),
    voices: [
      { id: 'voice1', name: 'Test Voice 1', language: 'en-US' },
      { id: 'voice2', name: 'Test Voice 2', language: 'en-GB' }
    ],
    selectedVoice: { id: 'voice1', name: 'Test Voice 1', language: 'en-US' },
    setSelectedVoice: jest.fn(),
    sentences: ['Sentence one.', 'Sentence two.', 'Sentence three.'],
    currentSentenceIndex: 1,
    isSpeechSynthesisSupported: true
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Set up the mock return value for useTTS
    const { useTTS } = require('../../context/TTSContext');
    useTTS.mockReturnValue(mockTTS);
  });

  test('renders player controls correctly', () => {
    render(<TTSPlayer />);
    
    // Check for play button
    const playButton = screen.getByLabelText('Play');
    expect(playButton).toBeInTheDocument();
    
    // Check for navigation buttons
    expect(screen.getByLabelText('Previous sentence')).toBeInTheDocument();
    expect(screen.getByLabelText('Next sentence')).toBeInTheDocument();
    expect(screen.getByLabelText('Stop')).toBeInTheDocument();
    
    // Check for speed control
    expect(screen.getByLabelText('Playback speed')).toBeInTheDocument();
    
    // Check for voice selection
    expect(screen.getByLabelText('Voice selection')).toBeInTheDocument();
    
    // Check for progress bar
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    
    // Check for current sentence display
    expect(screen.getByText(/Sentence two./)).toBeInTheDocument();
  });

  test('clicking play button calls play function', () => {
    render(<TTSPlayer />);
    
    const playButton = screen.getByLabelText('Play');
    fireEvent.click(playButton);
    
    expect(mockTTS.play).toHaveBeenCalledTimes(1);
  });

  test('clicking stop button calls stop function', () => {
    const playingMockTTS = {
      ...mockTTS,
      isPlaying: true
    };
    
    const { useTTS } = require('../../context/TTSContext');
    useTTS.mockReturnValue(playingMockTTS);
    
    render(<TTSPlayer />);
    
    const stopButton = screen.getByLabelText('Stop');
    fireEvent.click(stopButton);
    
    expect(mockTTS.stop).toHaveBeenCalledTimes(1);
  });

  test('clicking next button calls nextSentence function', () => {
    render(<TTSPlayer />);
    
    const nextButton = screen.getByLabelText('Next sentence');
    fireEvent.click(nextButton);
    
    expect(mockTTS.nextSentence).toHaveBeenCalledTimes(1);
  });

  test('clicking previous button calls previousSentence function', () => {
    render(<TTSPlayer />);
    
    const prevButton = screen.getByLabelText('Previous sentence');
    fireEvent.click(prevButton);
    
    expect(mockTTS.previousSentence).toHaveBeenCalledTimes(1);
  });

  test('changing speed calls changeSpeed function', () => {
    render(<TTSPlayer />);
    
    const speedSelect = screen.getByLabelText('Playback speed');
    fireEvent.change(speedSelect, { target: { value: '1.5' } });
    
    expect(mockTTS.changeSpeed).toHaveBeenCalledWith(1.5);
  });

  test('changing voice calls setSelectedVoice function', () => {
    render(<TTSPlayer />);
    
    const voiceSelect = screen.getByLabelText('Voice selection');
    fireEvent.change(voiceSelect, { target: { value: 'voice2' } });
    
    expect(mockTTS.setSelectedVoice).toHaveBeenCalledWith(mockTTS.voices[1]);
  });

  test('displays speech synthesis support indicator when not supported', () => {
    const unsupportedMockTTS = {
      ...mockTTS,
      isSpeechSynthesisSupported: false
    };
    
    const { useTTS } = require('../../context/TTSContext');
    useTTS.mockReturnValue(unsupportedMockTTS);
    
    render(<TTSPlayer />);
    
    expect(screen.getByText(/Web Speech API not supported/)).toBeInTheDocument();
  });

  test('displays pause button when playing', () => {
    const playingMockTTS = {
      ...mockTTS,
      isPlaying: true
    };
    
    const { useTTS } = require('../../context/TTSContext');
    useTTS.mockReturnValue(playingMockTTS);
    
    render(<TTSPlayer />);
    
    const pauseButton = screen.getByLabelText('Pause');
    expect(pauseButton).toBeInTheDocument();
    
    fireEvent.click(pauseButton);
    expect(mockTTS.pause).toHaveBeenCalledTimes(1);
  });

  test('calculates progress percentage correctly', () => {
    render(<TTSPlayer />);
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '66.66666666666666');
    expect(progressBar).toHaveStyle('width: 66.66666666666666%');
    expect(progressBar).toHaveTextContent('2 / 3');
  });

  test('disables previous button when at first sentence', () => {
    const firstSentenceMockTTS = {
      ...mockTTS,
      currentSentenceIndex: 0
    };
    
    const { useTTS } = require('../../context/TTSContext');
    useTTS.mockReturnValue(firstSentenceMockTTS);
    
    render(<TTSPlayer />);
    
    const prevButton = screen.getByLabelText('Previous sentence');
    expect(prevButton).toBeDisabled();
  });

  test('disables next button when at last sentence', () => {
    const lastSentenceMockTTS = {
      ...mockTTS,
      currentSentenceIndex: 2
    };
    
    const { useTTS } = require('../../context/TTSContext');
    useTTS.mockReturnValue(lastSentenceMockTTS);
    
    render(<TTSPlayer />);
    
    const nextButton = screen.getByLabelText('Next sentence');
    expect(nextButton).toBeDisabled();
  });
});
