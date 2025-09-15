import { useEffect, useRef } from 'react';

type GameState = 'menu' | 'playing' | 'paused' | 'gameOver';

interface GameCanvasProps {
  gameState: GameState;
}

export default function GameCanvas({ gameState }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Future: Add canvas-based game rendering here
  // This is where we would draw hearts, targets, particles, etc.

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        touchAction: 'none',
        pointerEvents: gameState === 'playing' ? 'none' : 'auto',
      }}
      data-testid="game-canvas"
    />
  );
}
