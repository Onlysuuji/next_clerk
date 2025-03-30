// 音声オプションの型定義
export type VoiceOption = {
    id: string;
    gender: "male" | "female";
    display: string;
};

// 各言語で利用可能な声のマッピング
export const VOICE_OPTIONS: { [key: string]: VoiceOption[] } = {
    "japanese": [
        { id: "ja-JP-NanamiNeural", gender: "female", display: "七海（女性）" },
        { id: "ja-JP-KeitaNeural", gender: "male", display: "圭太（男性）" },
        { id: "ja-JP-AoiNeural", gender: "female", display: "葵（女性）" },
        { id: "ja-JP-DaichiNeural", gender: "male", display: "大地（男性）" },
        { id: "ja-JP-MayuNeural", gender: "female", display: "まゆ（女性）" },
        { id: "ja-JP-ShioriNeural", gender: "female", display: "志織（女性）" }
    ],
    "english": [
        { id: "en-US-JennyNeural", gender: "female", display: "Jenny (女性)" },
        { id: "en-US-GuyNeural", gender: "male", display: "Guy (男性)" },
        { id: "en-US-AriaNeural", gender: "female", display: "Aria (女性)" },
        { id: "en-US-DavisNeural", gender: "male", display: "Davis (男性)" },
        { id: "en-US-AmberNeural", gender: "female", display: "Amber (女性)" },
        { id: "en-US-AndrewNeural", gender: "male", display: "Andrew (男性)" }
    ],
    "chinese": [
        { id: "zh-CN-XiaoxiaoNeural", gender: "female", display: "晓晓 (女性)" },
        { id: "zh-CN-YunjianNeural", gender: "male", display: "云健 (男性)" },
        { id: "zh-CN-XiaoyiNeural", gender: "female", display: "晓伊 (女性)" },
        { id: "zh-CN-YunyangNeural", gender: "male", display: "云扬 (男性)" },
        { id: "zh-CN-XiaochenNeural", gender: "female", display: "晓辰 (女性)" },
        { id: "zh-CN-YunxiNeural", gender: "male", display: "云希 (男性)" }
    ],
    "french": [
        { id: "fr-FR-DeniseNeural", gender: "female", display: "Denise (女性)" },
        { id: "fr-FR-HenriNeural", gender: "male", display: "Henri (男性)" },
        { id: "fr-FR-EloiseNeural", gender: "female", display: "Eloise (女性)" },
        { id: "fr-FR-JacquelineNeural", gender: "female", display: "Jacqueline (女性)" },
        { id: "fr-FR-JeromeNeural", gender: "male", display: "Jerome (男性)" },
        { id: "fr-FR-YvesNeural", gender: "male", display: "Yves (男性)" }
    ]
};