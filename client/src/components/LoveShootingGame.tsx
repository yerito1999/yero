import { useState, useEffect, useCallback, useRef } from 'react';
import AudioManager from './AudioManager';
import MainMenu from './MainMenu';
import GameUI from './GameUI';
import CowCharacter from './CowCharacter';
import GameCanvas from './GameCanvas';
import { useGame } from '../hooks/useGame';
import { useAudio } from '../hooks/useAudio';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  animationDelay: number;
  animationDuration: number;
}

export default function LoveShootingGame() {
  const [stars, setStars] = useState<Star[]>([]);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  
  const {
    gameState,
    score,
    timeLeft,
    combo,
    difficulty,
    lovePercentage,
    startGame,
    endGame,
    pauseGame,
    resumeGame,
    handleShoot,
    setDifficulty,
    resetGame,
    cowAnimation,
  } = useGame();

  const {
    isPlaying,
    isMusicEnabled,
    volume,
    togglePlayPause,
    setVolume,
    toggleMusicEnabled,
    playMusic,
    stopMusic,
  } = useAudio();

  // Create stars on component mount
  useEffect(() => {
    const createStars = () => {
      const newStars: Star[] = [];
      for (let i = 0; i < 50; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          animationDelay: Math.random() * 3,
          animationDuration: Math.random() * 3 + 2,
        });
      }
      setStars(newStars);
    };

    createStars();
  }, []);

  // Handle game start
  const handleGameStart = useCallback(async () => {
    startGame();
    if (isMusicEnabled) {
      await playMusic();
    }
  }, [startGame, isMusicEnabled, playMusic]);

  // Handle game end
  const handleGameEnd = useCallback(async () => {
    endGame();
    await stopMusic();
  }, [endGame, stopMusic]);

  // Handle click/touch events for shooting
  const handleGameClick = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (gameState === 'playing') {
      const clientX = 'clientX' in event ? event.clientX : event.touches[0].clientX;
      const clientY = 'clientY' in event ? event.clientY : event.touches[0].clientY;
      handleShoot(clientX, clientY);
    }
  }, [gameState, handleShoot]);

  // Handle visibility change for audio management
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (gameState === 'playing') {
          pauseGame();
        }
        stopMusic();
      } else if (gameState === 'paused' && isMusicEnabled) {
        resumeGame();
        playMusic();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [gameState, isMusicEnabled, pauseGame, resumeGame, playMusic, stopMusic]);

  // Auto-enable audio on first user interaction
  useEffect(() => {
    const enableAudio = () => {
      if (isMusicEnabled && !isPlaying && gameState === 'menu') {
        playMusic();
      }
    };

    document.addEventListener('click', enableAudio, { once: true });
    document.addEventListener('touchstart', enableAudio, { once: true });

    return () => {
      document.removeEventListener('click', enableAudio);
      document.removeEventListener('touchstart', enableAudio);
    };
  }, [isMusicEnabled, isPlaying, gameState, playMusic]);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Background Stars */}
      <div className="stars">
        {stars.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.animationDelay}s`,
              animationDuration: `${star.animationDuration}s`,
            }}
          />
        ))}
      </div>

      {/* Audio Manager */}
      <AudioManager
        isPlaying={isPlaying}
        volume={volume}
        isMusicEnabled={isMusicEnabled}
        onTogglePlayPause={togglePlayPause}
        onVolumeChange={setVolume}
        onToggleMusicEnabled={toggleMusicEnabled}
      />

      {/* Game Container */}
      <div
        ref={gameContainerRef}
        id="gameContainer"
        className="w-full h-full relative z-[2]"
        onClick={handleGameClick}
        onTouchStart={handleGameClick}
        data-testid="game-container"
      >
        {/* Game Canvas */}
        <GameCanvas gameState={gameState} />

        {/* Cow Character */}
        <CowCharacter animation={cowAnimation} />

        {/* Game UI */}
        {gameState === 'playing' && (
          <GameUI
            score={score}
            timeLeft={timeLeft}
            combo={combo}
            lovePercentage={lovePercentage}
          />
        )}

        {/* Main Menu */}
        {gameState === 'menu' && (
          <MainMenu
            difficulty={difficulty}
            isMusicEnabled={isMusicEnabled}
            onStartGame={handleGameStart}
            onDifficultyChange={setDifficulty}
            onMusicToggle={toggleMusicEnabled}
          />
        )}

        {/* Game Over Screen */}
        {gameState === 'gameOver' && (
          <div className="menu" data-testid="game-over-screen">
            <h1>¡Juego Terminado!</h1>
            <p className="menu-subtitle">Puntuación Final: {score} ❤️</p>
            <div style={{
              background: 'rgba(255,51,153,0.2)',
              padding: '20px',
              borderRadius: '15px',
              margin: '25px 0',
              border: '1px solid #ff3399'
            }}>
              <p style={{ color: '#ffd700', fontSize: '16px', marginBottom: '8px' }}>
                💖 ¡Gracias por jugar, mi amor!
              </p>
              <p style={{ color: '#ff99cc', fontSize: '14px' }}>
                Tu amor siempre será mi mayor tesoro
              </p>
            </div>
            <button
              onClick={handleGameStart}
              className="menu button"
              style={{ margin: '15px', fontSize: '18px' }}
              data-testid="button-play-again"
            >
              💖 Jugar de Nuevo
            </button>
            <button
              onClick={resetGame}
              className="menu button"
              style={{ margin: '15px', fontSize: '18px' }}
              data-testid="button-menu"
            >
              🏠 Menú Principal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
