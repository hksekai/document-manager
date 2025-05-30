import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TTSHighlighter from './TTSHighlighter';
import { useTTS } from '../../context/TTSContext';

// Mock the TTS context
jest.mock('../../context/TTSContext', () => {
  return {
    useTTS: jest.fn()
  };
});

describe('TTSHighlighter', () => {
  const mockTTS = {
    sentences: ['First sentence.', 'Second sentence.', 'Third sentence.'],
    currentSentenceIndex: 1,
    skipToSentence: jest.fn(),
    parseContent: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useTTS.mockReturnValue(mockTTS);
  });

  test('renders content with highlighted sentence', () => {
    render(<TTSHighlighter content="First sentence. Second sentence. Third sentence." />);
    
    // Get all sentence elements
    const sentenceElements = screen.getAllByRole('button');
    expect(sentenceElements).toHaveLength(3);
    
    // Check that the current sentence is highlighted
    expect(sentenceElements[1]).toHaveClass('highlight');
    expect(sentenceElements[0]).not.toHaveClass('highlight');
    expect(sentenceElements[2]).not.toHaveClass('highlight');
  });

  test('calls parseContent if no sentences are available', () => {
    const emptyMockTTS = {
      ...mockTTS,
      sentences: [],
      parseContent: jest.fn()
    };
    useTTS.mockReturnValue(emptyMockTTS);
    
    render(<TTSHighlighter content="Test content" />);
    
    expect(emptyMockTTS.parseContent).toHaveBeenCalledWith('Test content');
  });

  test('renders plain content if no sentences are available', () => {
    const emptyMockTTS = {
      ...mockTTS,
      sentences: [],
      parseContent: jest.fn()
    };
    useTTS.mockReturnValue(emptyMockTTS);
    
    render(<TTSHighlighter content="Test content" />);
    
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  test('clicking on a sentence calls skipToSentence with correct index', () => {
    render(<TTSHighlighter content="First sentence. Second sentence. Third sentence." />);
    
    const sentenceElements = screen.getAllByRole('button');
    
    // Click on the third sentence
    fireEvent.click(sentenceElements[2]);
    
    expect(mockTTS.skipToSentence).toHaveBeenCalledWith(2);
  });

  test('pressing Enter on a sentence calls skipToSentence', () => {
    render(<TTSHighlighter content="First sentence. Second sentence. Third sentence." />);
    
    const sentenceElements = screen.getAllByRole('button');
    
    // Press Enter on the first sentence
    fireEvent.keyDown(sentenceElements[0], { key: 'Enter' });
    
    expect(mockTTS.skipToSentence).toHaveBeenCalledWith(0);
  });

  test('pressing Space on a sentence calls skipToSentence', () => {
    render(<TTSHighlighter content="First sentence. Second sentence. Third sentence." />);
    
    const sentenceElements = screen.getAllByRole('button');
    
    // Press Space on the first sentence
    fireEvent.keyDown(sentenceElements[0], { key: ' ' });
    
    expect(mockTTS.skipToSentence).toHaveBeenCalledWith(0);
  });

  test('does not call skipToSentence when pressing other keys', () => {
    render(<TTSHighlighter content="First sentence. Second sentence. Third sentence." />);
    
    const sentenceElements = screen.getAllByRole('button');
    
    // Press a different key on the first sentence
    fireEvent.keyDown(sentenceElements[0], { key: 'A' });
    
    expect(mockTTS.skipToSentence).not.toHaveBeenCalled();
  });

  test('sets correct aria attributes for accessibility', () => {
    render(<TTSHighlighter content="First sentence. Second sentence. Third sentence." />);
    
    const sentenceElements = screen.getAllByRole('button');
    
    // Check aria-current on the current sentence
    expect(sentenceElements[1]).toHaveAttribute('aria-current', 'true');
    
    // Check aria-label on sentences
    expect(sentenceElements[0]).toHaveAttribute('aria-label', 'Sentence 1 of 3');
    expect(sentenceElements[1]).toHaveAttribute('aria-label', 'Sentence 2 of 3');
    expect(sentenceElements[2]).toHaveAttribute('aria-label', 'Sentence 3 of 3');
  });

  test('adds space between sentences for readability', () => {
    render(<TTSHighlighter content="First sentence. Second sentence. Third sentence." />);
    
    // Check that there's a space after each sentence
    const highlighterElement = screen.getByRole('button', { name: /Sentence 1 of 3/ }).parentElement;
    expect(highlighterElement.innerHTML).toContain('First sentence. </span> <span');
  });
});
