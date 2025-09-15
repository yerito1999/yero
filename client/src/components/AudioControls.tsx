interface AudioControlsProps {
  audioSystem: any;
}

export default function AudioControls({ audioSystem }: AudioControlsProps) {
  return (
    <div className="audio-controls" data-testid="audio-controls">
      <button 
        className="audio-button" 
        onClick={audioSystem.togglePlayPause}
        data-testid="button-play-pause"
      >
        {audioSystem.isPlaying ? '⏸️' : '▶️'}
      </button>
      
      <div className="volume-control">
        <label className="text-white text-xs block">Volumen</label>
        <input 
          type="range" 
          className="volume-slider" 
          min="0" 
          max="100" 
          value={audioSystem.musicVolume * 100}
          onChange={(e) => audioSystem.setMusicVolume(Number(e.target.value) / 100)}
          data-testid="slider-volume"
        />
      </div>
      
      <button 
        className="audio-button" 
        onClick={audioSystem.toggleMute}
        data-testid="button-mute"
      >
        {audioSystem.isMuted ? '🔇' : '🔊'}
      </button>
    </div>
  );
}
