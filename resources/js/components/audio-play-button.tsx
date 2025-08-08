import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlayIcon, PauseIcon } from "lucide-react";
import { useAudioPlayer } from "@/context/audio-context";
import clsx from "clsx"; // Ensure clsx is installed

type AudioPlayButtonProps = {
    src: string;
    className?: string;
};

export function AudioPlayButton({ src, className }: AudioPlayButtonProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

    const { setCurrentAudio, registerReset } = useAudioPlayer();

    const handlePlay = () => {
        const newAudio = new Audio(src);
        newAudio.play();

        newAudio.onended = () => {
            setIsPlaying(false);
        };

        setAudio(newAudio);
        setCurrentAudio(newAudio);
        setIsPlaying(true);

        registerReset(() => {
            setIsPlaying(false);
            newAudio.pause();
            newAudio.currentTime = 0;
        });
    };

    const handlePause = () => {
        if (audio) {
            audio.pause();
        }
        setIsPlaying(false);
    };

    const toggleAudio = () => {
        isPlaying ? handlePause() : handlePlay();
    };

    useEffect(() => {
        return () => {
            audio?.pause();
        };
    }, [audio]);

    return (
        <Button onClick={toggleAudio} variant="outline" className={clsx("gap-2", className)}>
            {isPlaying ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
            {isPlaying ? "Stop" : "Preview"}
        </Button>
    );
}
