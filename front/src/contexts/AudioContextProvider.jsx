import { createContext, useContext, useEffect, useRef } from "react";

const AudioCtxContext = createContext();

export function AudioContextProvider({ children }) {
  const audioContextRef = useRef(null);

  const initializeAudioContext = async () => {
    try {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
        console.log(
          "AudioContext créé, état initial :",
          audioContextRef.current.state
        );
      }
      if (audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume();
        console.log(
          "AudioContext réactivé, nouvel état :",
          audioContextRef.current.state
        );
      }
      return audioContextRef.current;
    } catch (error) {
      console.error(
        "Erreur lors de l'initialisation de l'AudioContext :",
        error
      );
      return null;
    }
  };

// try to intialize when provider is mounted
  useEffect(() => {
    initializeAudioContext();
  }, []);

  return (
    <AudioCtxContext.Provider
      value={{
        audioContext: audioContextRef.current,
        initializeAudioContext,
      }}
    >
      {children}
    </AudioCtxContext.Provider>
  );
}

export function useAudioContext() {
  const context = useContext(AudioCtxContext);
  if (!context) {
    throw new Error("useAudioContext used not in AudioContextProvider");
  }

  return context;
}
