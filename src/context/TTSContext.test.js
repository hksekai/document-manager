import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TTSProvider, { useTTS } from './TTSContext';
import mockApi from '../mocks/api';

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

const mockSpeechSynthesisUtterance = jest.fn().mockImplementation((text) => ({
  text,
  voice: null,
  rate: 1,
  pitch: 1,
  volume: 1,
  lang: 'en-US',
  onend: null,
  onerror: null
}));

// Mock the mockApi
jest.mock('../mocks/api', () => ({
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

// Setup and cleanup for Web Speech API mocks
beforeAll(() => {
  // Mock the Web Speech API
  global.SpeechSynthesisUtterance = mockSpeechSynthesisUtterance;
  global.speechSynthesis = mockSpeechSynthesis;
  
  // Mock the 'in window' check
  Object.defineProperty(window, 'speechSynthesis', {
    value: mockSpeechSynthesis,
    writable: true
  });
});

afterAll(() => {
  // Clean up
  delete global.SpeechSynthesisUtterance;
  delete global.speechSynthesis;
  delete window.speechSynthesis;
});

// Test component that uses the TTS context
const TestComponent = () => {
  const {
    isPlaying,
    currentSentenceIndex,
    sentences,
    play,
    pause,
    stop,
    skipToSentence,
    nextSentence,
    previousSentence,
    speed,
    changeSpeed,
    isSpeechSynthesisSupported
  } = useTTS();

  return (
    <div>
      <div data-testid="playing-status">{isPlaying ? 'playing' : 'paused'}</div>
      <div data-testid="current-index">{currentSentenceIndex}</div>
      <div data-testid="sentences-count">{sentences.length}</div>
      <div data-testid="speed">{speed}</div>
      <button data-testid="play-button" onClick={play}>Play</button>
      <button data-testid="pause-button" onClick={pause}>Pause</button>
      <button data-testid="stop-button" onClick={stop}>Stop</button>
      <button data-testid="next-button" onClick={nextSentence}>Next</button>
      <button data-testid="prev-button" onClick={previousSentence}>Previous</button>
      <button data-testid="skip-button" onClick={() => skipToSentence(1)}>Skip to 1</button>
      <button data-testid="speed-button" onClick={() => changeSpeed(1.5)}>Change Speed</button>
    </div>
  );
};

describe('TTSContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('initializes with default values', async () => {
    render(
      <TTSProvider documentContent="Test sentence one. Test sentence two.">
        <TestComponent />
      </TTSProvider>
    );

    // Wait for voices to load
    await waitFor(() => {
      expect(mockApi.getTtsVoices).toHaveBeenCalled();
    });

    expect(screen.getByTestId('playing-status')).toHaveTextContent('paused');
    expect(screen.getByTestId('current-index')).toHaveTextContent('0');
    expect(screen.getByTestId('speed')).toHaveTextContent('1');
  });

  test('parses document content into sentences', async () => {
    render(
      <TTSProvider documentContent="Test sentence one. Test sentence two. Test sentence three!">
        <TestComponent />
      </TTSProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('sentences-count')).toHaveTextContent('3');
    });
  });

  test('plays and pauses audio', async () => {
    render(
      <TTSProvider documentContent="Test sentence one. Test sentence two.">
        <TestComponent />
      </TTSProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('sentences-count')).toHaveTextContent('2');
    });

    // Play
    userEvent.click(screen.getByTestId('play-button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('playing-status')).toHaveTextContent('playing');
    });
    
    // Verify speech synthesis was called
    expect(mockSpeechSynthesis.speak).toHaveBeenCalled();

    // Pause
    userEvent.click(screen.getByTestId('pause-button'));
    
    expect(screen.getByTestId('playing-status')).toHaveTextContent('paused');
    expect(mockSpeechSynthesis.pause).toHaveBeenCalled();
  });
  
  test('stops audio playback', async () => {
    render(
      <TTSProvider documentContent="Test sentence one. Test sentence two.">
        <TestComponent />
      </TTSProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('sentences-count')).toHaveTextContent('2');
    });

    // Play
    userEvent.click(screen.getByTestId('play-button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('playing-status')).toHaveTextContent('playing');
    });

    // Stop
    userEvent.click(screen.getByTestId('stop-button'));
    
    expect(screen.getByTestId('playing-status')).toHaveTextContent('paused');
    expect(mockSpeechSynthesis.cancel).toHaveBeenCalled();
  });

  test('navigates between sentences', async () => {
    render(
      <TTSProvider documentContent="Test sentence one. Test sentence two. Test sentence three.">
        <TestComponent />
      </TTSProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('sentences-count')).toHaveTextContent('3');
    });

    // Initial index should be 0
    expect(screen.getByTestId('current-index')).toHaveTextContent('0');

    // Skip to sentence 1
    userEvent.click(screen.getByTestId('skip-button'));
    expect(screen.getByTestId('current-index')).toHaveTextContent('1');

    // Next sentence
    userEvent.click(screen.getByTestId('next-button'));
    expect(screen.getByTestId('current-index')).toHaveTextContent('2');

    // Previous sentence
    userEvent.click(screen.getByTestId('prev-button'));
    expect(screen.getByTestId('current-index')).toHaveTextContent('1');
  });

  test('changes playback speed', async () => {
    render(
      <TTSProvider documentContent="Test sentence one. Test sentence two.">
        <TestComponent />
      </TTSProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('sentences-count')).toHaveTextContent('2');
    });

    // Initial speed should be 1
    expect(screen.getByTestId('speed')).toHaveTextContent('1');

    // Change speed to 1.5
    userEvent.click(screen.getByTestId('speed-button'));
    expect(screen.getByTestId('speed')).toHaveTextContent('1.5');
  });

  test('automatically advances to next sentence after playback', async () => {
    render(
      <TTSProvider documentContent="Short sentence. Another short sentence.">
        <TestComponent />
      </TTSProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('sentences-count')).toHaveTextContent('2');
    });

    // Play
    userEvent.click(screen.getByTestId('play-button'));
    
    await waitFor(() => {
      expect(mockSpeechSynthesis.speak).toHaveBeenCalled();
    });

    // Simulate the utterance end event
    const utterance = mockSpeechSynthesisUtterance.mock.results[0].value;
    act(() => {
      if (utterance.onend) {
        utterance.onend();
      }
    });

    // Should have advanced to the next sentence
    expect(screen.getByTestId('current-index')).toHaveTextContent('1');
  });
  
  test('reports speech synthesis support status', async () => {
    render(
      <TTSProvider documentContent="Test sentence.">
        <div data-testid="speech-supported">{isSpeechSynthesisSupported ? 'supported' : 'not-supported'}</div>
      </TTSProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('speech-supported')).toHaveTextContent('supported');
    });
  });
});
