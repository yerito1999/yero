import { useState, useEffect, useRef, useCallback } from 'react';
import audioFile from '@assets/mi cancion_1757889965630.mp3';

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);
  const [volume, setVolumeState] = useState(70);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio(audioFile);
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = volume / 100;

    // Handle audio events
    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));
    audio.addEventListener('error', (e) => {
      console.warn('Audio file could not be loaded:', e);
    });

    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [volume]);

  // Fade in audio
  const fadeIn = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      if (!audioRef.current) {
        resolve();
        return;
      }

      const targetVolume = volume / 100;
      let currentVolume = 0;
      audioRef.current.volume = 0;

      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }

      fadeIntervalRef.current = setInterval(() => {
        currentVolume += 0.05;
        if (currentVolume >= targetVolume) {
          currentVolume = targetVolume;
          if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
          }
          resolve();
        }
        if (audioRef.current) {
          audioRef.current.volume = currentVolume;
        }
      }, 100);
    });
  }, [volume]);

  // Fade out audio
  const fadeOut = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      if (!audioRef.current) {
        resolve();
        return;
      }

      let currentVolume = audioRef.current.volume;

      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }

      fadeIntervalRef.current = setInterval(() => {
        currentVolume -= 0.05;
        if (currentVolume <= 0) {
          currentVolume = 0;
          if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
          }
          resolve();
        }
        if (audioRef.current) {
          audioRef.current.volume = currentVolume;
        }
      }, 50);
    });
  }, []);

  // Play music with fade in
  const playMusic = useCallback(async () => {
    if (!isMusicEnabled || !audioRef.current) return;

    try {
      await audioRef.current.play();
      await fadeIn();
    } catch (error) {
      console.warn('Audio autoplay failed:', error);
    }
  }, [isMusicEnabled, fadeIn]);

  // Stop music with fade out
  const stopMusic = useCallback(async () => {
    if (!audioRef.current || !isPlaying) return;

    await fadeOut();
    audioRef.current.pause();
  }, [isPlaying, fadeOut]);

  // Toggle play/pause
  const togglePlayPause = useCallback(async () => {
    if (!isMusicEnabled || !audioRef.current) return;

    if (isPlaying) {
      await stopMusic();
    } else {
      await playMusic();
    }
  }, [isMusicEnabled, isPlaying, playMusic, stopMusic]);

  // Set volume
  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  }, []);

  // Toggle music enabled
  const toggleMusicEnabled = useCallback(() => {
    setIsMusicEnabled(prev => {
      if (prev && isPlaying) {
        stopMusic();
      }
      return !prev;
    });
  }, [isPlaying, stopMusic]);

  return {
    isPlaying,
    isMusicEnabled,
    volume,
    playMusic,
    stopMusic,
    togglePlayPause,
    setVolume,
    toggleMusicEnabled,
  };
}
