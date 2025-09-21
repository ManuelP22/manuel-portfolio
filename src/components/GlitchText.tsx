import { useState, useEffect } from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
}

export function GlitchText({ text, className = "" }: GlitchTextProps) {
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 150);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const getGlitchedText = (originalText: string) => {
    if (!glitching) return originalText;
    
    return originalText
      .split('')
      .map(char => 
        Math.random() > 0.7 
          ? glitchChars[Math.floor(Math.random() * glitchChars.length)]
          : char
      )
      .join('');
  };

  return (
    <span 
      className={`${className} ${glitching ? 'animate-pulse text-cyan-400' : ''} transition-colors duration-150`}
    >
      {getGlitchedText(text)}
    </span>
  );
}