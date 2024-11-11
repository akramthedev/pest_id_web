import React, { useState, useEffect } from 'react';

const TypewriterEffect = ({ text, speed = 150 }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayedText(prev => prev + text[i]);
      i++;
      if (i === text.length) clearInterval(intervalId);
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);

  return <div>{displayedText}</div>;
};

export default TypewriterEffect;