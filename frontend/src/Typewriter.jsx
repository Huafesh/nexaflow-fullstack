import { useState, useEffect } from 'react';

function Typewriter({ text, speed = 30, delay = 0, isErasing = false, onEraseComplete }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timer;
    let delayTimer;

    if (isErasing) {
      setIsTyping(true);
      let charIndex = displayedText.length;
      
      timer = setInterval(() => {
        if (charIndex > 0) {
          setDisplayedText(text.substring(0, charIndex - 1));
          charIndex--;
        } else {
          clearInterval(timer);
          setIsTyping(false);
          if (onEraseComplete) onEraseComplete();
        }
      }, speed / 1.5);
    } else {
      setDisplayedText('');
      setIsTyping(true);
      let charIndex = 0;

      const startTyping = () => {
        timer = setInterval(() => {
          if (charIndex < text.length) {
            setDisplayedText(text.substring(0, charIndex + 1));
            charIndex++;
          } else {
            clearInterval(timer);
            setIsTyping(false);
          }
        }, speed);
      };

      if (delay > 0) {
        delayTimer = setTimeout(startTyping, delay);
      } else {
        startTyping();
      }
    }

    return () => {
      clearInterval(timer);
      clearTimeout(delayTimer);
    };
  }, [text, speed, delay, isErasing]);

  return (
    <span>
      {displayedText}
      <span className="typewriter-cursor">|</span>
    </span>
  );
}

export default Typewriter;
