import { useRef, useCallback, useMemo } from "react";
import { useAudioEngine } from "./useAudioEngine";

// CONSTANTS

const DEFAULT_PLAY_OPTIONS: Required<Pick<PlayAudioOptions, 'volume' | 'loop'>> = {
  volume: 1,
  loop: false,
};

// TYPES

type PlayAudioOptions = {
  key?: string;
  volume?: number;
  loop?: boolean;
};

type UseAudioOptions = {
  key?: string;
  channel?: string;
};

type UseAudioResult = {
  play: (url: string, options?: PlayAudioOptions) => Promise<void>;
  stop: (key?: string) => void;
  getAudioTrack: (key?: string) => AudioTrackRef | null;
};

type AudioTrackRef = {
  source: AudioBufferSourceNode;
  url: string;
};

/**
 * useAudio
 * --------
 * 
 * 
 */
export const useAudio = (rootOptions?: UseAudioOptions): UseAudioResult => {
  const { key: rootKey, channel } = rootOptions || {};
  
  const engine = useAudioEngine();
  const tracks = useRef<Map<string, AudioTrackRef>>(new Map());

  /**
   * Play an audio track, and return a promise that resolves when the track completes.
   */
  const play = useCallback(async (url: string, options?: PlayAudioOptions): Promise<void> => {
    const key = options?.key || rootKey;
    const { volume, loop } = { ...DEFAULT_PLAY_OPTIONS, ...options };

    // Connect the gain node to the destination.
    const gain = new GainNode(engine.context);
    gain.gain.value = volume;
    gain.connect(engine.getChannel(channel));

    // Connect the source node to the gain node.
    const source = new AudioBufferSourceNode(engine.context);
    source.loop = loop;
    source.connect(gain);
    source.start(0);

    // Keep track of keyed tracks.
    if (key) {
      tracks.current.set(key, { source, url });
    }

    // Get an audio buffer for the given url.
    const buffer = await engine.getBuffer(url);
    source.buffer = buffer;
    
    // Return a promise which resolves when the track has ended.
    // Note: Only clear the track if another one hasn't already replaced it.
    return new Promise((resolve): void => {
      source.addEventListener('ended', () => resolve());
    });
  }, [channel, engine, rootKey]);

  /**
   * Stop the track with the given key, if it is playing.
   */
  const stop = useCallback((key?: string) => {
    const k = key || rootKey;

    if (k) {
      const track = tracks.current.get(k);

      if (track) {
        track.source.stop();
        tracks.current.delete(k);
      }
    }
  }, [rootKey]);

  /**
   * Lookup an audio track by its unique key. If an audio track wasn't assigned a key, it cannot
   * be looked up.
   */
  const getAudioTrack = useCallback((key?: string): AudioTrackRef | null => {
    const k = key || rootKey;
    
    if (k) {
      return tracks.current.get(k) || null;
    } else {
      return null;
    }
  }, [rootKey]);

  return useMemo(() => ({ play, stop, getAudioTrack }), [play, stop, getAudioTrack]);
};