interface GameUIProps {
  gameState: any;
}

export default function GameUI({ gameState }: GameUIProps) {
  const accuracy = gameState.shots > 0 ? Math.round((gameState.hits / gameState.shots) * 100) : 100;
  const lovePercentage = Math.min((gameState.score / 1000) * 100, 100);

  return (
    <div className="game-ui" data-testid="game-ui">
      <div className="game-stats">
        <div>💖 Amor: <span data-testid="text-score">{gameState.score}</span></div>
        <div>⏱️ Tiempo: <span data-testid="text-timer">{gameState.timeLeft}</span>s</div>
        <div>🎯 Precisión: <span data-testid="text-accuracy">{accuracy}</span>%</div>
      </div>
      
      <div className="love-bar">
        <div 
          className="love-fill" 
          style={{ width: `${lovePercentage}%` }}
          data-testid="love-fill"
        ></div>
      </div>
      
      {gameState.combo >= 3 && (
        <div className="combo-display" data-testid="combo-display">
          🔥 ¡Combo x<span data-testid="combo-count">{gameState.combo}</span>!
        </div>
      )}
    </div>
  );
}
