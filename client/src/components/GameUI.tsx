import { useState, useEffect } from 'react';

interface GameUIProps {
  score: number;
  timeLeft: number;
  combo: number;
  lovePercentage: number;
}

export default function GameUI({ score, timeLeft, combo, lovePercentage }: GameUIProps) {
  const [showCombo, setShowCombo] = useState(false);

  // Show combo display when combo changes
  useEffect(() => {
    if (combo > 1) {
      setShowCombo(true);
      const timer = setTimeout(() => setShowCombo(false), 2000);
      return () => clearTimeout(timer);
    } else {
      setShowCombo(false);
    }
  }, [combo]);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="ui" data-testid="game-ui">
      {/* Stats Bar */}
      <div className="stats">
        <div data-testid="score-display">💖 Amor: <span>{score}</span></div>
        <div data-testid="timer-display">⏰ <span>{formatTime(timeLeft)}</span></div>
        <div data-testid="combo-display">🎯 Combo: <span>{combo}</span></div>
      </div>

      {/* Love Progress Bar */}
      <div className="love-bar">
        <div 
          className="love-fill" 
          style={{ width: `${Math.min(lovePercentage, 100)}%` }}
          data-testid="love-fill"
        />
      </div>

      {/* Combo Display */}
      {showCombo && combo > 1 && (
        <div className="combo-display" data-testid="combo-multiplier">
          🔥 ¡Combo x<span>{combo}</span>!
        </div>
      )}

      {/* Instructions */}
      <div 
        className="instructions"
        style={{
          position: 'absolute',
          bottom: '25px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, rgba(0,0,0,0.8), rgba(26,0,51,0.8))',
          padding: '15px 30px',
          borderRadius: '25px',
          textAlign: 'center',
          border: '1px solid rgba(255, 51, 153, 0.5)',
          backdropFilter: 'blur(10px)',
          fontSize: '16px',
          textShadow: '0 0 10px rgba(255, 51, 153, 0.8)',
        }}
        data-testid="game-instructions"
      >
        💕 Toca/Clic para disparar corazones • Mueve para apuntar a las pizzas mexicanas 🌮
      </div>
    </div>
  );
}
