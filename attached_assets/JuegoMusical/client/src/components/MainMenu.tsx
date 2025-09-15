import { useState } from 'react';

type Difficulty = 'easy' | 'medium' | 'hard';

interface MainMenuProps {
  difficulty: Difficulty;
  isMusicEnabled: boolean;
  onStartGame: () => void;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onMusicToggle: () => void;
}

export default function MainMenu({
  difficulty,
  isMusicEnabled,
  onStartGame,
  onDifficultyChange,
  onMusicToggle,
}: MainMenuProps) {
  const [showInstructions, setShowInstructions] = useState(false);

  const difficultyOptions = [
    { value: 'easy' as const, label: '💕 Fácil - Amor Tierno', emoji: '🌮' },
    { value: 'medium' as const, label: '💖 Medio - Amor Intenso', emoji: '🌶️' },
    { value: 'hard' as const, label: '💗 Difícil - Amor Apasionado', emoji: '🔥' },
  ];

  return (
    <>
      <div className="menu" data-testid="main-menu">
        <h1>My Jero💖</h1>
        <p className="menu-subtitle">Tiroteo de Amor</p>
        
        <div style={{
          background: 'rgba(255,51,153,0.2)',
          padding: '20px',
          borderRadius: '15px',
          margin: '25px 0',
          border: '1px solid #ff3399'
        }}>
          <p style={{ color: '#ffd700', fontSize: '16px', marginBottom: '8px' }}>
            🎵 Juego especial para mi amor
          </p>
          <p style={{ color: '#ff99cc', fontSize: '14px' }}>
            Con toda mi dedicación y cariño
          </p>
        </div>

        {/* Music Toggle Button */}
        <button
          className={`music-toggle-btn ${isMusicEnabled ? 'music-on' : 'music-off'}`}
          onClick={onMusicToggle}
          data-testid="button-music-toggle"
        >
          <span>🎵</span>
          <span>{isMusicEnabled ? 'Música: Activada' : 'Música: Desactivada'}</span>
        </button>

        <h3 style={{ color: '#ff99cc', margin: '25px 0 15px' }}>
          Selecciona tu Nivel de Picante:
        </h3>

        {/* Difficulty Selection */}
        {difficultyOptions.map((option) => (
          <button
            key={option.value}
            className={`difficulty-btn ${difficulty === option.value ? 'selected' : ''}`}
            onClick={() => onDifficultyChange(option.value)}
            data-testid={`button-difficulty-${option.value}`}
          >
            {option.label}
          </button>
        ))}

        {/* Action Buttons */}
        <button
          onClick={onStartGame}
          className="menu button"
          style={{ marginTop: '30px', fontSize: '20px', padding: '20px 40px' }}
          data-testid="button-start-game"
        >
          ¡Comenzar Aventura de Amor!
        </button>

        <button
          onClick={() => setShowInstructions(true)}
          className="menu button"
          style={{ fontSize: '16px' }}
          data-testid="button-instructions"
        >
          📖 Instrucciones
        </button>
      </div>

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="menu" data-testid="instructions-modal">
          <h2>📖 Instrucciones</h2>
          <div style={{ textAlign: 'left', margin: '20px 0' }}>
            <p style={{ marginBottom: '15px', color: '#ff99cc' }}>
              💖 <strong>Objetivo:</strong> Dispara corazones para conseguir el mayor puntaje de amor posible
            </p>
            <p style={{ marginBottom: '15px', color: '#ff99cc' }}>
              🎯 <strong>Controles:</strong> Haz clic o toca la pantalla para disparar
            </p>
            <p style={{ marginBottom: '15px', color: '#ff99cc' }}>
              ⏱️ <strong>Tiempo:</strong> Tienes 60 segundos para demostrar tu amor
            </p>
            <p style={{ marginBottom: '15px', color: '#ff99cc' }}>
              🔥 <strong>Combos:</strong> Disparos consecutivos multiplican tu puntuación
            </p>
            <p style={{ color: '#ffd700' }}>
              ¡Buena suerte, mi amor! 💕
            </p>
          </div>
          <button
            onClick={() => setShowInstructions(false)}
            className="menu button"
            data-testid="button-close-instructions"
          >
            ❌ Cerrar
          </button>
        </div>
      )}
    </>
  );
}
