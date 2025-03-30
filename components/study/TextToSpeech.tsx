"use client";

import { useTestLanguage } from "@/context/TestLanguageContext";
import { VOICE_OPTIONS } from "@/constants/VoiceOptions";


const TextToSpeech = ({ text = "hello world, this is a test message, please check if the text is being read correctly", audioUrl, voice, setVoice }: { text: string, audioUrl: string | null, voice: string, setVoice: (voice: string) => void }) => {
    const { language } = useTestLanguage()
    const availableVoices = VOICE_OPTIONS[language];

    return (
        <>
            <div className="flex items-center gap-x-2">
                <audio controls src={audioUrl || undefined}></audio>
                <select
                    value={voice}
                    onChange={(e) => setVoice(e.target.value)}
                    className="p-2 border rounded"
                >
                    {availableVoices?.map(voiceOption => (
                        <option key={voiceOption.id} value={voiceOption.id}>
                            {voiceOption.display}
                        </option>
                    ))}
                </select>
            </div>
        </>

    );
};

export default TextToSpeech;
