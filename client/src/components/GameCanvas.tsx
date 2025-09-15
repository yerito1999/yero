import { useEffect, useRef } from 'react';
import { drawHeart, createHitParticles, createFloatingScore } from '@/utils/gameLogic';

interface GameCanvasProps {
  gameState: any;
  isPlaying: boolean;
  onGameOver: () => void;
  difficulty: 'easy' | 'medium' | 'hard';
  audioSystem: any;
  cowRef: React.RefObject<HTMLDivElement>;
}

export default function GameCanvas({ 
  gameState, 
  isPlaying, 
  onGameOver, 
  difficulty, 
  audioSystem,
  cowRef 
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const lastSpawnRef = useRef(0);

  const difficultySettings = {
    easy: { targetSize: 40, targetSpeed: 2, spawnRate: 0.7, spawnInterval: 1500 },
    medium: { targetSize: 30, targetSpeed: 3, spawnRate: 0.8, spawnInterval: 1200 },
    hard: { targetSize: 25, targetSpeed: 4, spawnRate: 0.9, spawnInterval: 1000 }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas
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

  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const settings = difficultySettings[difficulty];

    // Game loop
    const gameLoop = (timestamp: number) => {
      if (!isPlaying) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn targets
      if (timestamp - lastSpawnRef.current > settings.spawnInterval) {
        if (Math.random() < settings.spawnRate) {
          gameState.spawnTarget({
            x: canvas.width + 50,
            y: Math.random() * (canvas.height - 100) + 50,
            size: settings.targetSize,
            speed: settings.targetSpeed,
            type: 'heart',
            color: `hsl(${330 + Math.random() * 30}, 100%, ${60 + Math.random() * 20}%)`
          });
        }
        lastSpawnRef.current = timestamp;
      }

      // Update and draw targets
      gameState.targets.forEach((target: any, index: number) => {
        target.x -= target.speed;

        // Remove targets that went off screen
        if (target.x + target.size < 0) {
          gameState.removeTarget(index);
          gameState.resetCombo();
          return;
        }

        // Draw heart target
        drawHeart(ctx, target.x, target.y, target.size, target.color);
      });

      // Update and draw bullets
      gameState.bullets.forEach((bullet: any, index: number) => {
        bullet.x += bullet.speedX;
        bullet.y += bullet.speedY;

        // Remove bullets that went off screen
        if (bullet.x > canvas.width || bullet.x < 0 || 
            bullet.y > canvas.height || bullet.y < 0) {
          gameState.removeBullet(index);
          return;
        }

        // Draw bullet
        ctx.fillStyle = '#ff3399';
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, 5, 0, Math.PI * 2);
        ctx.fill();

        // Add trail effect
        ctx.fillStyle = 'rgba(255, 51, 153, 0.3)';
        ctx.beginPath();
        ctx.arc(bullet.x - bullet.speedX, bullet.y - bullet.speedY, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Update and draw particles
      gameState.particles.forEach((particle: any, index: number) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;

        if (particle.life <= 0) {
          gameState.removeParticle(index);
          return;
        }

        // Draw particle
        const alpha = particle.life / particle.maxLife;
        ctx.fillStyle = `rgba(255, 51, 153, ${alpha})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Check collisions
      gameState.bullets.forEach((bullet: any, bulletIndex: number) => {
        gameState.targets.forEach((target: any, targetIndex: number) => {
          const distance = Math.sqrt(
            Math.pow(bullet.x - target.x, 2) + 
            Math.pow(bullet.y - target.y, 2)
          );

          if (distance < target.size / 2 + 5) {
            // Hit!
            gameState.registerHit();
            
            // Calculate score based on combo
            const baseScore = 10;
            const comboBonus = Math.floor(gameState.combo / 5) * 5;
            const scoreGain = baseScore + comboBonus;
            gameState.addScore(scoreGain);

            // Create hit effects
            createHitParticles(gameState, target.x, target.y);
            createFloatingScore(target.x, target.y, scoreGain);

            // Play hit sound
            audioSystem.playHitSound();

            // Remove bullet and target
            gameState.removeBullet(bulletIndex);
            gameState.removeTarget(targetIndex);

            return;
          }
        });
      });

      // Check if game should end
      if (gameState.timeLeft <= 0) {
        onGameOver();
        return;
      }

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, difficulty, gameState, onGameOver, audioSystem]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const targetX = event.clientX - rect.left;
    const targetY = event.clientY - rect.top;

    shoot(targetX, targetY);
  };

  const handleCanvasTouch = (event: React.TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const touch = event.touches[0];
    const targetX = touch.clientX - rect.left;
    const targetY = touch.clientY - rect.top;

    shoot(targetX, targetY);
  };

  const shoot = (targetX: number, targetY: number) => {
    gameState.incrementShots();

    // Get cow position
    const cowX = 170; // Approximate cow center
    const cowY = window.innerHeight / 2;

    // Calculate bullet direction
    const deltaX = targetX - cowX;
    const deltaY = targetY - cowY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    const bulletSpeed = 8;
    const speedX = (deltaX / distance) * bulletSpeed;
    const speedY = (deltaY / distance) * bulletSpeed;

    // Create bullet
    gameState.addBullet({
      x: cowX,
      y: cowY,
      speedX: speedX,
      speedY: speedY
    });

    // Cow shooting animation
    if (cowRef.current) {
      cowRef.current.classList.add('cow-shooting');
      setTimeout(() => {
        cowRef.current?.classList.remove('cow-shooting');
      }, 400);
    }

    // Play shoot sound
    audioSystem.playShootSound();
  };

  return (
    <canvas
      ref={canvasRef}
      className="game-canvas"
      onClick={handleCanvasClick}
      onTouchStart={handleCanvasTouch}
      data-testid="game-canvas"
    />
  );
}
