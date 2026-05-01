import { useState, useEffect, useCallback } from 'react';

const generateBubbleProps = (id) => ({
  id,
  key: `${id}-${Date.now()}-${Math.random()}`,
  size: Math.random() * 50 + 40, // Tamaños entre 40px y 90px
  left: Math.random() * 100, // 0% a 100% del ancho
  animationDuration: Math.random() * 10 + 10, // 10s a 20s para ascender
  animationDelay: Math.random() * 10, // 0s a 10s para aparecer
  swayDelay: Math.random() * 5, // Desfase del balanceo
  isPopped: false
});

function InteractiveBubbles() {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    // Generamos 12 burbujas iniciales
    const initialBubbles = Array.from({ length: 12 }).map((_, i) => generateBubbleProps(i));
    setBubbles(initialBubbles);
  }, []);

  const playPopSound = useCallback(() => {
    const audio = new Audio('/sounds/freesound_community-bubble-sound-43207 (mp3cut.net).mp3');
    audio.volume = 0.5;
    audio.play().catch(e => console.log('Error al reproducir sonido de burbuja:', e));
  }, []);

  const handlePop = (id) => {
    setBubbles(currentBubbles => 
      currentBubbles.map(bubble => {
        if (bubble.id === id && !bubble.isPopped) {
          playPopSound();
          return { ...bubble, isPopped: true };
        }
        return bubble;
      })
    );

    // Reiniciamos la burbuja después de que termine la animación de explosión
    setTimeout(() => {
      handleReset(id);
    }, 300); // 300ms debe coincidir con la duración de bubble-pop en CSS
  };

  const handleReset = (id) => {
    setBubbles(currentBubbles =>
      currentBubbles.map(bubble => {
        if (bubble.id === id) {
          return generateBubbleProps(id);
        }
        return bubble;
      })
    );
  };

  return (
    <div className="interactive-bubbles-layer" aria-hidden="true">
      {bubbles.map(bubble => (
        <div
          key={bubble.key}
          className="interactive-bubble-wrapper"
          style={{
            left: `${bubble.left}%`,
            animationDuration: `${bubble.animationDuration}s`,
            animationDelay: `${bubble.animationDelay}s`
          }}
          onAnimationEnd={(e) => {
            if (e.animationName === 'interactive-ascend') {
              handleReset(bubble.id);
            }
          }}
        >
          <div
            className={`interactive-bubble ${bubble.isPopped ? 'popped' : ''}`}
            style={{
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              animationDelay: `${bubble.swayDelay}s`
            }}
            onMouseEnter={() => handlePop(bubble.id)}
            onTouchStart={(e) => {
              e.preventDefault(); // Evita el scroll o doble toque accidental
              handlePop(bubble.id);
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default InteractiveBubbles;
