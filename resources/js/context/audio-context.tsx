import React, { createContext, useContext, useRef, useState } from "react";

type AudioContextType = {
    currentAudio: HTMLAudioElement | null;
    setCurrentAudio: (audio: HTMLAudioElement | null) => void;
    setResetOther: (() => void) | null;
    registerReset: (cb: () => void) => void;
};

const AudioPlayerContext = createContext<AudioContextType | null>(null);

export const useAudioPlayer = () => {
    const ctx = useContext(AudioPlayerContext);
    if (!ctx) throw new Error("useAudioPlayer must be used inside AudioPlayerProvider");
    return ctx;
};

export const AudioPlayerProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
    const resetOtherRef = useRef<(() => void) | null>(null);

    const registerReset = (cb: () => void) => {
        resetOtherRef.current = cb;
    };

    return (
        <AudioPlayerContext.Provider
            value={{
                currentAudio,
                setCurrentAudio: (audio) => {
                    // stop the current audio
                    if (currentAudio && currentAudio !== audio) {
                        currentAudio.pause();
                        currentAudio.currentTime = 0;
                    }

                    // reset previous button
                    if (resetOtherRef.current && currentAudio !== audio) {
                        resetOtherRef.current();
                        resetOtherRef.current = null;
                    }

                    setCurrentAudio(audio);
                },
                setResetOther: resetOtherRef.current,
                registerReset,
            }}
        >
            {children}
        </AudioPlayerContext.Provider>
    );
};
