import React, { useCallback, useMemo, useRef, useState } from "react";

const DEFAULT = 'primary';

type AudioChannel = { node: GainNode, volume: number, mute: boolean };

type AudioEngineContextProps = {
  context: AudioContext,
  mute: (name?: string) => void;
  unmute: (name?: string) => void;
  toggle: (name?: string) => void;
  setVolume: (name?: string, volume?: number) => void;
  getChannel: (name?: string) => AudioChannel,
  getBuffer: (url: string) => Promise<AudioBuffer | null>,
}

export const AudioEngineContext = React.createContext<AudioEngineContextProps>({
  context: new AudioContext(),
  mute: () => {},
  unmute: () => {},
  toggle: () => {},
  setVolume: () => {},
  getChannel: () => null as unknown as AudioChannel,
  getBuffer: async () => null as unknown as AudioBuffer,
});

type AudioEngineProps = {
  children: React.ReactNode;
};

export const AudioEngine: React.FC<AudioEngineProps> = ({ children }) => {
  const [context] = useState(new AudioContext({ latencyHint: 'interactive' }));
  
  const channels = useRef<Map<string, AudioChannel>>(new Map());
  const buffers = useRef<Map<string, AudioBuffer>>(new Map());

  /**
   * Get an audio buffer for a given URL, cached locally to avoid repeatedly initialising the same
   * buffers over and buffer, which is costly.
   */
  const getBuffer = useCallback(async (url: string): Promise<AudioBuffer | null> => {
    if (!buffers.current.has(url)) {
      const response = await fetch(url);
      const data = await response.arrayBuffer();
      const buffer = await context.decodeAudioData(data);
      buffers.current.set(url, buffer);
    }
    
    return buffers.current.get(url) || null;
  }, [context]);

  /**
   * Get the destination node for the given channel, creating one if necessary.
   * The 'primary' channel will be hooked up to the context destination, but all others will be
   * connected to the 'primary' channel. This make it easy to control the primary audio volume,
   * but also control music and sound effects independently.
   */
  const getChannel = useCallback((name = DEFAULT): AudioChannel => {
    const existing = channels.current.get(name);

    if (existing) {
      return existing;
    } else {
      const destination = name === DEFAULT ? context.destination : getChannel(DEFAULT).node;
      const node = createDestination(context, destination, 0.5);
      const channel = { node, volume: 0.5, mute: false };
      channels.current.set(name, channel);
      return channel;
    }
  }, [context]);

  /**
   * Update some settings for the specified channel, then sync the settings to the audio tree.
   */
  const updateChannel = useCallback((name = DEFAULT, options: Partial<Omit<AudioChannel, 'node'>>) => {
    const prev = getChannel(name);
    const next = { ...prev, ...options };

    channels.current.set(name, next);

    next.node.gain.value = next.volume * (next.mute ? 0 : 1);
  }, [getChannel]);

  /**
   * Set the volume of an individual audio channel.
   */
  const setVolume = useCallback((name = DEFAULT, volume?: number) => {
    updateChannel(name, { volume });
  }, [updateChannel]);

  /**
   * Mute the given audio channel. Defaults to primary, muting everything.
   */
  const mute = useCallback((name = DEFAULT) => {
    updateChannel(name, { mute: true });
  }, [updateChannel]);

  /**
   * Unmute the given audio channel. Defaults to primary, unmuting everything.
   */
  const unmute = useCallback((name = DEFAULT) => {
    updateChannel(name, { mute: true });
  }, [updateChannel]);

  /**
   * Toggle the given audio channel. If it was muted, it'll be unmuted, and vice-versa.
   */
  const toggle = useCallback((name = DEFAULT) => {
    updateChannel(name, { mute: !getChannel(name).mute });
  }, [getChannel, updateChannel]);

  /**
   * Setup the react context.
   */
  const value = useMemo(() => ({
    context,
    mute,
    unmute,
    toggle,
    setVolume,
    getChannel,
    getBuffer,
  }), [context, mute, unmute, toggle, setVolume, getChannel, getBuffer]);

  return (
    <AudioEngineContext.Provider value={value}>
      {children}
    </AudioEngineContext.Provider>
  );
};

/**
 * Create a new destination node, itself connected up to the given destination.
 */
const createDestination = (context: AudioContext, destination: AudioNode, volume: number): GainNode => {
  const result = new GainNode(context);
  result.gain.value = volume;
  result.connect(destination);
  return result;
};
