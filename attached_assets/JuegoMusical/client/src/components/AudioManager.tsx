import { useEffect, useRef } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import audioFile from '@assets/mi cancion_1757889965630.mp3';

interface AudioManagerProps {
  isPlaying: boolean;
  volume: number;
  isMusicEnabled: boolean;
  onTogglePlayPause: () => void;
  onVolumeChange: (volume: number) => void;
  onToggleMusicEnabled: () => void;
}

export default function AudioManager({
  isPlaying,
  volume,
  isMusicEnabled,
  onTogglePlayPause,
  onVolumeChange,
  onToggleMusicEnabled,
}: AudioManagerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  // Handle volume slider change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    onVolumeChange(newVolume);
  };

  // Music wave animation component
  const MusicWaves = () => (
    <div className="music-indicator">
      <div className={`music-wave ${!isPlaying ? 'paused' : ''}`} />
      <div className={`music-wave ${!isPlaying ? 'paused' : ''}`} />
      <div className={`music-wave ${!isPlaying ? 'paused' : ''}`} />
      <div className={`music-wave ${!isPlaying ? 'paused' : ''}`} />
    </div>
  );

  if (!isMusicEnabled) {
    return null;
  }

  return (
    <>
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        style={{ display: 'none' }}
        data-testid="background-music"
      >
        <source src={audioFile} type="audio/mpeg" />
        Tu navegador no soporta audio HTML5.
      </audio>

      {/* Audio Controls Panel */}
      <div className="audio-controls" data-testid="audio-controls">
        {/* Play/Pause Button */}
        <button
          className="audio-btn"
          onClick={onTogglePlayPause}
          title={isPlaying ? "Pausar música" : "Reproducir música"}
          data-testid="button-play-pause"
        >
          {isPlaying ? (
            <Pause size={16} />
          ) : (
            <Play size={16} />
          )}
        </button>

        {/* Volume Control */}
        <div className="volume-container">
          <Volume2 size={14} />
          <input
            type="range"
            className="volume-slider"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            title="Control de volumen"
            data-testid="volume-slider"
          />
        </div>

        {/* Music Playing Indicator */}
        <MusicWaves />
      </div>
    </>
  );
}
