import { useState, useCallback, useRef, useEffect } from 'react';

type GameState = 'menu' | 'playing' | 'paused' | 'gameOver';
type Difficulty = 'easy' | 'medium' | 'hard';
type CowAnimation = 'floating' | 'shooting' | 'celebrating';

interface HeartProjectile {
  id: number;
  x: number;
  y: number;
  timestamp: number;
}

export function useGame() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [combo, setCombo] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [cowAnimation, setCowAnimation] = useState<CowAnimation>('floating');
  const [heartProjectiles, setHeartProjectiles] = useState<HeartProjectile[]>([]);

  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);
  const comboTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const projectileIdRef = useRef(0);

  // Calculate love percentage based on score
  const lovePercentage = Math.min((score / 1000) * 100, 100);

  // Difficulty settings
  const difficultySettings = {
    easy: { timeLimit: 90, pointMultiplier: 1 },
    medium: { timeLimit: 60, pointMultiplier: 1.5 },
    hard: { timeLimit: 45, pointMultiplier: 2 },
  };

  // Start game
  const startGame = useCallback(() => {
    setGameState('playing');
    setScore(0);
    setCombo(0);
    setTimeLeft(difficultySettings[difficulty].timeLimit);
    setCowAnimation('floating');

    // Start game timer
    gameTimerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameState('gameOver');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [difficulty]);

  // End game
  const endGame = useCallback(() => {
    setGameState('gameOver');
    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current);
      gameTimerRef.current = null;
    }
    if (comboTimeoutRef.current) {
      clearTimeout(comboTimeoutRef.current);
      comboTimeoutRef.current = null;
    }
    setCowAnimation('celebrating');
  }, []);

  // Pause game
  const pauseGame = useCallback(() => {
    if (gameState === 'playing') {
      setGameState('paused');
      if (gameTimerRef.current) {
        clearInterval(gameTimerRef.current);
        gameTimerRef.current = null;
      }
    }
  }, [gameState]);

  // Resume game
  const resumeGame = useCallback(() => {
    if (gameState === 'paused') {
      setGameState('playing');
      // Resume timer
      gameTimerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState('gameOver');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [gameState]);

  // Reset game to menu
  const resetGame = useCallback(() => {
    setGameState('menu');
    setScore(0);
    setCombo(0);
    setTimeLeft(60);
    setCowAnimation('floating');
    setHeartProjectiles([]);
    
    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current);
      gameTimerRef.current = null;
    }
    if (comboTimeoutRef.current) {
      clearTimeout(comboTimeoutRef.current);
      comboTimeoutRef.current = null;
    }
  }, []);

  // Handle shooting
  const handleShoot = useCallback((x: number, y: number) => {
    if (gameState !== 'playing') return;

    // Create heart projectile
    const newProjectile: HeartProjectile = {
      id: projectileIdRef.current++,
      x,
      y,
      timestamp: Date.now(),
    };

    setHeartProjectiles(prev => [...prev, newProjectile]);

    // Remove projectile after animation
    setTimeout(() => {
      setHeartProjectiles(prev => prev.filter(p => p.id !== newProjectile.id));
    }, 1000);

    // Trigger cow shooting animation
    setCowAnimation('shooting');
    setTimeout(() => setCowAnimation('floating'), 400);

    // Update score and combo
    const basePoints = 10;
    const comboMultiplier = Math.max(1, combo);
    const difficultyMultiplier = difficultySettings[difficulty].pointMultiplier;
    const points = Math.floor(basePoints * comboMultiplier * difficultyMultiplier);

    setScore(prev => prev + points);
    setCombo(prev => prev + 1);

    // Reset combo after inactivity
    if (comboTimeoutRef.current) {
      clearTimeout(comboTimeoutRef.current);
    }
    comboTimeoutRef.current = setTimeout(() => {
      setCombo(0);
    }, 2000);
  }, [gameState, combo, difficulty]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (gameTimerRef.current) {
        clearInterval(gameTimerRef.current);
      }
      if (comboTimeoutRef.current) {
        clearTimeout(comboTimeoutRef.current);
      }
    };
  }, []);

  // Auto end game when time runs out
  useEffect(() => {
    if (timeLeft === 0 && gameState === 'playing') {
      endGame();
    }
  }, [timeLeft, gameState, endGame]);

  return {
    gameState,
    score,
    timeLeft,
    combo,
    difficulty,
    lovePercentage,
    cowAnimation,
    heartProjectiles,
    startGame,
    endGame,
    pauseGame,
    resumeGame,
    resetGame,
    handleShoot,
    setDifficulty,
  };
}
