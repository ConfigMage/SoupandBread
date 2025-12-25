'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

type AppState = 'unopened' | 'opening' | 'playing' | 'complete';

// Christmas delivery confirmation script
const scriptLines = [
  { text: '★ CLASSIFIED ★', delay: 0 },
  { text: '', delay: 800 },
  { text: 'NORTH POLE OPERATIONS', delay: 1000 },
  { text: 'DIVISION OF GIFT LOGISTICS', delay: 1800 },
  { text: '', delay: 2800 },
  { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━', delay: 3000 },
  { text: '', delay: 3200 },
  { text: 'PACKAGE DELIVERY CONFIRMATION', delay: 3400 },
  { text: '', delay: 4200 },
  { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━', delay: 4400 },
  { text: '', delay: 4600 },
  { text: 'DATE: December 25th', delay: 4800 },
  { text: '', delay: 5400 },
  { text: 'TIME: 0256 hours', delay: 5600 },
  { text: '', delay: 6200 },
  { text: 'LOCATION:', delay: 6400 },
  { text: 'Near the Homestead front', delay: 6800 },
  { text: 'Atop the Rickety stairs', delay: 7400 },
  { text: '', delay: 8200 },
  { text: 'STATUS: ✓ DELIVERED', delay: 8400 },
  { text: '', delay: 9200 },
  { text: 'FIELD AGENT: S. Claus', delay: 9400 },
  { text: '', delay: 10200 },
  { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━', delay: 10400 },
  { text: '', delay: 10600 },
  { text: 'PHOTOGRAPHIC EVIDENCE:', delay: 10800 },
  { text: '', delay: 11400 },
  { text: '__IMAGE__', delay: 11600 }, // Special marker for image
  { text: '', delay: 12400 },
  { text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━', delay: 12600 },
  { text: '', delay: 12800 },
  { text: 'Contents verified and secured.', delay: 13000 },
  { text: '', delay: 13800 },
  { text: '🎄 Merry Christmas 🎄', delay: 14000 },
  { text: '', delay: 14800 },
  { text: '— North Pole HQ', delay: 15000 },
];

function Envelope({ isOpening, onClick }: { isOpening: boolean; onClick: () => void }) {
  return (
    <div className="flex flex-col items-center gap-10">
      <div className={`envelope ${isOpening ? 'opening' : ''}`}>
        <div className="envelope-flap" />
        <div className="wax-seal" />
      </div>
      {!isOpening && (
        <button onClick={onClick} className="open-button">
          OPEN
        </button>
      )}
    </div>
  );
}

interface MessageDisplayProps {
  completedLines: string[];
  currentLine: string;
  isTyping: boolean;
  showImage: boolean;
}

function MessageDisplay({ completedLines, currentLine, isTyping, showImage }: MessageDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new content appears
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [completedLines, currentLine, showImage]);

  const renderLine = (line: string, index: number, isCurrent: boolean = false) => {
    if (line === '__IMAGE__') {
      return (
        <div key={index} className="image-container my-4">
          <Image
            src="/delivery-confirmation.jpg"
            alt="Package delivery confirmation"
            width={400}
            height={300}
            className="rounded-lg border-2 border-green-500/50 shadow-lg shadow-green-500/20"
            style={{ objectFit: 'contain' }}
          />
        </div>
      );
    }

    if (line === '') {
      return <p key={index} className="h-4" />;
    }

    return (
      <p key={index}>
        {line}
        {isCurrent && isTyping && <span className="cursor" />}
      </p>
    );
  };

  return (
    <div className="message-container" ref={containerRef}>
      {/* Completed lines */}
      {completedLines.map((line, index) => renderLine(line, index))}
      {/* Current line being typed */}
      {currentLine !== null && currentLine !== '__IMAGE__' && (
        <p>
          {currentLine}
          {isTyping && <span className="cursor" />}
        </p>
      )}
      {/* Show image if we've passed the image marker */}
      {showImage && (
        <div className="image-container my-4">
          <Image
            src="/delivery-confirmation.jpg"
            alt="Package delivery confirmation"
            width={400}
            height={300}
            className="rounded-lg border-2 border-green-500/50 shadow-lg shadow-green-500/20"
            style={{ objectFit: 'contain' }}
          />
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [appState, setAppState] = useState<AppState>('unopened');
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  const [currentLineText, setCurrentLineText] = useState('');
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [showImage, setShowImage] = useState(false);

  // Handle opening the envelope
  const handleOpen = () => {
    setAppState('opening');

    // After envelope animation, start playing
    setTimeout(() => {
      setAppState('playing');
    }, 800);
  };

  // Typewriter effect for text - rolling credits style
  useEffect(() => {
    if (appState !== 'playing') return;

    const currentLine = scriptLines[currentLineIndex];
    if (!currentLine) {
      setAppState('complete');
      return;
    }

    // Handle image marker
    if (currentLine.text === '__IMAGE__') {
      setShowImage(true);
      if (currentLineIndex < scriptLines.length - 1) {
        const nextLine = scriptLines[currentLineIndex + 1];
        const delay = nextLine.delay - currentLine.delay;
        const timer = setTimeout(() => {
          setCurrentLineIndex(prev => prev + 1);
          setCurrentCharIndex(0);
        }, delay);
        return () => clearTimeout(timer);
      }
      return;
    }

    // Empty lines create a blank line break
    if (currentLine.text === '') {
      if (currentCharIndex === 0) {
        setCompletedLines(prev => [...prev, '']);
        setCurrentLineText('');

        if (currentLineIndex < scriptLines.length - 1) {
          const nextLine = scriptLines[currentLineIndex + 1];
          const delay = nextLine.delay - currentLine.delay;
          const timer = setTimeout(() => {
            setCurrentLineIndex(prev => prev + 1);
            setCurrentCharIndex(0);
          }, delay);
          return () => clearTimeout(timer);
        }
      }
      return;
    }

    // Type out characters
    if (currentCharIndex < currentLine.text.length) {
      const timer = setTimeout(() => {
        setCurrentLineText(currentLine.text.slice(0, currentCharIndex + 1));
        setCurrentCharIndex(prev => prev + 1);
      }, 35); // Character typing speed
      return () => clearTimeout(timer);
    } else {
      // Line complete, add to completed lines and move to next
      if (currentLineIndex < scriptLines.length - 1) {
        const nextLine = scriptLines[currentLineIndex + 1];
        const delay = nextLine.text === '' ? 500 : 100;
        const timer = setTimeout(() => {
          // Move current line to completed
          setCompletedLines(prev => [...prev, currentLine.text]);
          setCurrentLineText('');
          setCurrentLineIndex(prev => prev + 1);
          setCurrentCharIndex(0);
        }, delay);
        return () => clearTimeout(timer);
      } else {
        // Last line complete
        setCompletedLines(prev => [...prev, currentLine.text]);
        setCurrentLineText('');
        setAppState('complete');
      }
    }
  }, [appState, currentLineIndex, currentCharIndex]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      {/* Snowflake decorations */}
      <div className="snowflakes" aria-hidden="true">
        <div className="snowflake">❄</div>
        <div className="snowflake">❄</div>
        <div className="snowflake">❄</div>
        <div className="snowflake">❄</div>
        <div className="snowflake">❄</div>
      </div>

      {/* Unopened or opening state */}
      {(appState === 'unopened' || appState === 'opening') && (
        <Envelope isOpening={appState === 'opening'} onClick={handleOpen} />
      )}

      {/* Playing or complete state */}
      {(appState === 'playing' || appState === 'complete') && (
        <MessageDisplay
          completedLines={completedLines}
          currentLine={currentLineText}
          isTyping={currentCharIndex < (scriptLines[currentLineIndex]?.text.length || 0)}
          showImage={showImage}
        />
      )}
    </main>
  );
}
