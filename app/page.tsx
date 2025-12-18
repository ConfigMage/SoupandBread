'use client';

import { useState, useEffect, useRef } from 'react';

type AppState = 'loading' | 'unopened' | 'opening' | 'playing' | 'destroying' | 'destroyed';

// Script lines to display (excluding stage directions)
// Empty text entries act as line breaks/pauses
const scriptLines = [
  { text: 'Good evening.', delay: 0 },
  { text: '', delay: 1500 },
  { text: 'Your mission… should you choose to accept it…', delay: 2000 },
  { text: '', delay: 5500 },
  { text: 'Is deceptively simple.', delay: 7000 },
  { text: '', delay: 9000 },
  { text: 'Step one.', delay: 10000 },
  { text: '', delay: 11000 },
  { text: 'Toast the bread… in the air fryer.', delay: 11500 },
  { text: '', delay: 14500 },
  { text: 'Step two.', delay: 15000 },
  { text: '', delay: 16000 },
  { text: 'Warm the soup… in the microwave.', delay: 16500 },
  { text: '', delay: 19500 },
  { text: 'Step three.', delay: 20000 },
  { text: '', delay: 21000 },
  { text: 'Dip the bread.', delay: 21500 },
  { text: '', delay: 23500 },
  { text: 'And finally…', delay: 24000 },
  { text: '', delay: 25500 },
  { text: 'Change. Your. Life.', delay: 26000 },
  { text: '', delay: 28500 },
  { text: 'This message will self-destruct…', delay: 29000 },
  { text: '', delay: 32000 },
  { text: 'In five… four… three… two… one.', delay: 33000 },
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
}

function MessageDisplay({ completedLines, currentLine, isTyping }: MessageDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new content appears
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [completedLines, currentLine]);

  return (
    <div className="message-container" ref={containerRef}>
      {/* Completed lines */}
      {completedLines.map((line, index) => (
        <p key={index} className={line === '' ? 'h-4' : ''}>
          {line}
        </p>
      ))}
      {/* Current line being typed */}
      {currentLine !== null && (
        <p>
          {currentLine}
          {isTyping && <span className="cursor" />}
        </p>
      )}
    </div>
  );
}

function StaticEffect() {
  return <div className="static-overlay" />;
}

function FakePage404() {
  return (
    <div className="error-page min-h-screen flex flex-col items-center justify-center bg-white">
      <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
      <p className="text-xl text-gray-500 mb-2">Page Not Found</p>
      <p className="text-gray-400 text-sm">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
    </div>
  );
}

export default function Home() {
  const [appState, setAppState] = useState<AppState>('loading');
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  const [currentLineText, setCurrentLineText] = useState('');
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [showFlash, setShowFlash] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasDestroyedRef = useRef(false);

  // Check initial status
  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch('/api/status');
        const data = await res.json();
        if (data.destroyed) {
          setAppState('destroyed');
        } else {
          setAppState('unopened');
        }
      } catch (error) {
        console.error('Error checking status:', error);
        setAppState('unopened');
      }
    }
    checkStatus();
  }, []);

  // Handle opening the envelope
  const handleOpen = () => {
    setAppState('opening');

    // After envelope animation, start playing
    setTimeout(() => {
      setAppState('playing');
      if (audioRef.current) {
        audioRef.current.play().catch(console.error);
      }
    }, 800);
  };

  // Handle audio ending
  const handleAudioEnd = async () => {
    if (hasDestroyedRef.current) return;
    hasDestroyedRef.current = true;

    // Trigger destruction sequence
    setAppState('destroying');
    setShowFlash(true);

    // Call destroy API
    try {
      await fetch('/api/destroy', { method: 'POST' });
    } catch (error) {
      console.error('Error destroying:', error);
    }

    // Flash effect then show 404
    setTimeout(() => {
      setShowFlash(false);
      setAppState('destroyed');
    }, 500);
  };

  // Typewriter effect for text - rolling credits style
  useEffect(() => {
    if (appState !== 'playing') return;

    const currentLine = scriptLines[currentLineIndex];
    if (!currentLine) return;

    // Empty lines create a blank line break
    if (currentLine.text === '') {
      // Add empty line to completed lines
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
      }, 50); // Character typing speed
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
      }
    }
  }, [appState, currentLineIndex, currentCharIndex]);

  // Loading state
  if (appState === 'loading') {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-gray-600 text-sm">...</div>
      </main>
    );
  }

  // Destroyed state - show fake 404
  if (appState === 'destroyed') {
    return <FakePage404 />;
  }

  return (
    <main className={`min-h-screen flex items-center justify-center bg-[#0a0a0a] ${showFlash ? 'flash' : ''}`}>
      {/* Audio element */}
      <audio
        ref={audioRef}
        src="/VoiceMemo.mp3"
        onEnded={handleAudioEnd}
        preload="auto"
      />

      {/* Unopened or opening state */}
      {(appState === 'unopened' || appState === 'opening') && (
        <Envelope isOpening={appState === 'opening'} onClick={handleOpen} />
      )}

      {/* Playing state */}
      {appState === 'playing' && (
        <MessageDisplay
          completedLines={completedLines}
          currentLine={currentLineText}
          isTyping={currentCharIndex < (scriptLines[currentLineIndex]?.text.length || 0)}
        />
      )}

      {/* Destroying state - static effect */}
      {appState === 'destroying' && (
        <>
          <StaticEffect />
          <MessageDisplay
            completedLines={completedLines}
            currentLine={currentLineText}
            isTyping={false}
          />
        </>
      )}
    </main>
  );
}
