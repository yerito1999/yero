import { useState, useCallback, useRef, useEffect } from 'react';

type GameState = 'menu' | 'playing' | 'paused' | 'gameOver';
type Difficulty = 'easy' | 'medium' | 'hard';
type CowAnimation = 'floating' | 'shooting' | 'celebrating';

interface HeartProjectile {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
}

interface PizzaMonster {
  id: number;
  x: number;
  y: number;
  vx: number;
  emoji: string;
  size: number;
  life: number;
  points: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export function useGame() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [combo, setCombo] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [cowAnimation, setCowAnimation] = useState<CowAnimation>('floating');
  const [heartProjectiles, setHeartProjectiles] = useState<HeartProjectile[]>([]);
  const [pizzaMonsters, setPizzaMonsters] = useState<PizzaMonster[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [cowPosition, setCowPosition] = useState({ x: 50, y: 50 });

  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);
  const comboTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const projectileIdRef = useRef(0);
  const pizzaIdRef = useRef(0);
  const particleIdRef = useRef(0);
  const gameLoopRef = useRef<number | null>(null);
  const lastSpawnRef = useRef(0);

  // Calculate love percentage based on score
  const lovePercentage = Math.min((score / 1000) * 100, 100);

  // Difficulty settings
  const difficultySettings = {
    easy: { 
      timeLimit: 90, 
      pointMultiplier: 1, 
      pizzaSpeed: 2, 
      spawnRate: 2000,
      pizzaTypes: ['🍕', '🌮', '🌯']
    },
    medium: { 
      timeLimit: 60, 
      pointMultiplier: 1.5, 
      pizzaSpeed: 3, 
      spawnRate: 1500,
      pizzaTypes: ['🍕', '🌮', '🌯', '🥙']
    },
    hard: { 
      timeLimit: 45, 
      pointMultiplier: 2, 
      pizzaSpeed: 4, 
      spawnRate: 1000,
      pizzaTypes: ['🍕', '🌮', '🌯', '🥙', '🥪']
    },
  };

  // Create particle effect
  const createParticles = useCallback((x: number, y: number, color: string) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 8; i++) {
      newParticles.push({
        id: particleIdRef.current++,
        x,
        y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 40,
        maxLife: 40,
        color,
        size: Math.random() * 4 + 2,
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  }, []);

  // Spawn pizza monsters
  const spawnPizza = useCallback(() => {
    if (gameState !== 'playing') return;
    
    const now = Date.now();
    const config = difficultySettings[difficulty];
    
    if (now - lastSpawnRef.current < config.spawnRate) return;
    
    const types = config.pizzaTypes;
    const emoji = types[Math.floor(Math.random() * types.length)];
    
    const pizza: PizzaMonster = {
      id: pizzaIdRef.current++,
      x: window.innerWidth + 50,
      y: Math.random() * (window.innerHeight - 200) + 100,
      vx: -config.pizzaSpeed,
      emoji,
      size: 40,
      life: 300,
      points: emoji === '🌯' ? 150 : emoji === '🌮' ? 120 : 100,
    };
    
    setPizzaMonsters(prev => [...prev, pizza]);
    lastSpawnRef.current = now;
  }, [gameState, difficulty]);

  // Update game objects
  const updateGameObjects = useCallback(() => {
    // Update hearts
    setHeartProjectiles(prev => 
      prev.map(heart => ({
        ...heart,
        x: heart.x + heart.vx,
        y: heart.y + heart.vy,
        life: heart.life - 1
      })).filter(heart => heart.life > 0 && heart.x < window.innerWidth + 100)
    );
    
    // Update pizzas
    setPizzaMonsters(prev => 
      prev.map(pizza => ({
        ...pizza,
        x: pizza.x + pizza.vx,
        life: pizza.life - 1
      })).filter(pizza => pizza.life > 0 && pizza.x > -100)
    );
    
    // Update particles
    setParticles(prev => 
      prev.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        vx: particle.vx * 0.98,
        vy: particle.vy * 0.98,
        life: particle.life - 1
      })).filter(particle => particle.life > 0)
    );
  }, []);

  // Check collisions
  const checkCollisions = useCallback(() => {
    // Check heart-pizza collisions
    const newHearts: HeartProjectile[] = [];
    const newPizzas: PizzaMonster[] = [];
    let hitCount = 0;
    
    heartProjectiles.forEach(heart => {
      let heartHit = false;
      
      pizzaMonsters.forEach(pizza => {
        if (heartHit) return;
        
        const dx = heart.x - pizza.x;
        const dy = heart.y - pizza.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < (heart.size + pizza.size) / 2) {
          // Hit!
          heartHit = true;
          hitCount++;
          
          // Create particles
          createParticles(pizza.x, pizza.y, '#ff3399');
          
          // Update score
          const basePoints = pizza.points;
          const comboMultiplier = Math.max(1, combo + hitCount);
          const difficultyMultiplier = difficultySettings[difficulty].pointMultiplier;
          const points = Math.floor(basePoints * comboMultiplier * difficultyMultiplier);
          
          setScore(prev => prev + points);
          
          // Don't add this pizza back to the array (it's destroyed)
        } else {
          newPizzas.push(pizza);
        }
      });
      
      if (!heartHit) {
        newHearts.push(heart);
      }
    });
    
    if (hitCount > 0) {
      setCombo(prev => prev + hitCount);
      
      // Reset combo after inactivity
      if (comboTimeoutRef.current) {
        clearTimeout(comboTimeoutRef.current);
      }
      comboTimeoutRef.current = setTimeout(() => {
        setCombo(0);
      }, 2000);
    }
    
    // Remove duplicate pizzas (only keep ones that weren't hit)
    const uniquePizzas = newPizzas.filter((pizza, index, self) => 
      index === self.findIndex(p => p.id === pizza.id)
    );
    
    setHeartProjectiles(newHearts);
    setPizzaMonsters(uniquePizzas);
  }, [heartProjectiles, pizzaMonsters, combo, difficulty, createParticles]);

  // Start game
  const startGame = useCallback(() => {
    setGameState('playing');
    setScore(0);
    setCombo(0);
    setTimeLeft(difficultySettings[difficulty].timeLimit);
    setCowAnimation('floating');
    setHeartProjectiles([]);
    setPizzaMonsters([]);
    setParticles([]);
    setCowPosition({ x: 50, y: window.innerHeight / 2 });
    lastSpawnRef.current = 0;

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
    
    // Game loop will start automatically via useEffect
  }, [difficulty]);

  // Game loop effect
  useEffect(() => {
    if (gameState === 'playing') {
      const loop = () => {
        spawnPizza();
        updateGameObjects();
        checkCollisions();
        gameLoopRef.current = requestAnimationFrame(loop);
      };
      gameLoopRef.current = requestAnimationFrame(loop);
    } else if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
  }, [gameState, spawnPizza, updateGameObjects, checkCollisions]);

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
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
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
    setPizzaMonsters([]);
    setParticles([]);
    setCowPosition({ x: 50, y: 50 });
    
    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current);
      gameTimerRef.current = null;
    }
    if (comboTimeoutRef.current) {
      clearTimeout(comboTimeoutRef.current);
      comboTimeoutRef.current = null;
    }
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
  }, []);

  // Handle shooting
  const handleShoot = useCallback((x: number, y: number) => {
    if (gameState !== 'playing') return;

    // Calculate direction from cow to target
    const cowX = cowPosition.x + 60; // Cow center
    const cowY = cowPosition.y; 
    const dx = x - cowX;
    const dy = y - cowY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 50) return; // Don't shoot too close
    
    const speed = 12;
    
    // Create heart projectile
    const newProjectile: HeartProjectile = {
      id: projectileIdRef.current++,
      x: cowX,
      y: cowY,
      vx: (dx / distance) * speed,
      vy: (dy / distance) * speed,
      life: 120,
      size: 20,
    };

    setHeartProjectiles(prev => [...prev, newProjectile]);

    // Trigger cow shooting animation
    setCowAnimation('shooting');
    setTimeout(() => setCowAnimation('floating'), 400);

    // We'll handle scoring when projectiles hit targets, not when shooting
  }, [gameState, combo, difficulty]);

  // Move cow
  const moveCow = useCallback((x: number, y: number) => {
    if (gameState !== 'playing') return;
    
    const clampedY = Math.max(80, Math.min(window.innerHeight - 80, y));
    setCowPosition({ x: 50, y: clampedY });
  }, [gameState]);

  // Spawn pizza monsters
  const spawnPizza = useCallback(() => {
    if (gameState !== 'playing') return;
    
    const now = Date.now();
    const config = difficultySettings[difficulty];
    
    if (now - lastSpawnRef.current < config.spawnRate) return;
    
    const types = config.pizzaTypes;
    const emoji = types[Math.floor(Math.random() * types.length)];
    
    const pizza: PizzaMonster = {
      id: pizzaIdRef.current++,
      x: window.innerWidth + 50,
      y: Math.random() * (window.innerHeight - 200) + 100,
      vx: -config.pizzaSpeed,
      emoji,
      size: 40,
      life: 300,
      points: emoji === '🌯' ? 150 : emoji === '🌮' ? 120 : 100,
    };
    
    setPizzaMonsters(prev => [...prev, pizza]);
    lastSpawnRef.current = now;
  }, [gameState, difficulty]);

  // Create particle effect
  const createParticles = useCallback((x: number, y: number, color: string) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 8; i++) {
      newParticles.push({
        id: particleIdRef.current++,
        x,
        y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 40,
        maxLife: 40,
        color,
        size: Math.random() * 4 + 2,
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  }, []);

  // Check collisions
  const checkCollisions = useCallback(() => {
    // Check heart-pizza collisions
    const newHearts: HeartProjectile[] = [];
    const newPizzas: PizzaMonster[] = [];
    let hitCount = 0;
    
    heartProjectiles.forEach(heart => {
      let heartHit = false;
      
      pizzaMonsters.forEach(pizza => {
        if (heartHit) return;
        
        const dx = heart.x - pizza.x;
        const dy = heart.y - pizza.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < (heart.size + pizza.size) / 2) {
          // Hit!
          heartHit = true;
          hitCount++;
          
          // Create particles
          createParticles(pizza.x, pizza.y, '#ff3399');
          
          // Update score
          const basePoints = pizza.points;
          const comboMultiplier = Math.max(1, combo + hitCount);
          const difficultyMultiplier = difficultySettings[difficulty].pointMultiplier;
          const points = Math.floor(basePoints * comboMultiplier * difficultyMultiplier);
          
          setScore(prev => prev + points);
          
          // Don't add this pizza back to the array (it's destroyed)
        } else {
          newPizzas.push(pizza);
        }
      });
      
      if (!heartHit) {
        newHearts.push(heart);
      }
    });
    
    if (hitCount > 0) {
      setCombo(prev => prev + hitCount);
      
      // Reset combo after inactivity
      if (comboTimeoutRef.current) {
        clearTimeout(comboTimeoutRef.current);
      }
      comboTimeoutRef.current = setTimeout(() => {
        setCombo(0);
      }, 2000);
    }
    
    // Remove duplicate pizzas (only keep ones that weren't hit)
    const uniquePizzas = newPizzas.filter((pizza, index, self) => 
      index === self.findIndex(p => p.id === pizza.id)
    );
    
    setHeartProjectiles(newHearts);
    setPizzaMonsters(uniquePizzas);
  }, [heartProjectiles, pizzaMonsters, combo, difficulty, createParticles]);

  // Update game objects
  const updateGameObjects = useCallback(() => {
    // Update hearts
    setHeartProjectiles(prev => 
      prev.map(heart => ({
        ...heart,
        x: heart.x + heart.vx,
        y: heart.y + heart.vy,
        life: heart.life - 1
      })).filter(heart => heart.life > 0 && heart.x < window.innerWidth + 100)
    );
    
    // Update pizzas
    setPizzaMonsters(prev => 
      prev.map(pizza => ({
        ...pizza,
        x: pizza.x + pizza.vx,
        life: pizza.life - 1
      })).filter(pizza => pizza.life > 0 && pizza.x > -100)
    );
    
    // Update particles
    setParticles(prev => 
      prev.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        vx: particle.vx * 0.98,
        vy: particle.vy * 0.98,
        life: particle.life - 1
      })).filter(particle => particle.life > 0)
    );
  }, []);


  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (gameTimerRef.current) {
        clearInterval(gameTimerRef.current);
      }
      if (comboTimeoutRef.current) {
        clearTimeout(comboTimeoutRef.current);
      }
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
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
    pizzaMonsters,
    particles,
    cowPosition,
    startGame,
    endGame,
    pauseGame,
    resumeGame,
    resetGame,
    handleShoot,
    moveCow,
    setDifficulty,
  };
}
