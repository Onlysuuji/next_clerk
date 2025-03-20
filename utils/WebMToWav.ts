// WebMからWAVに変換する関数
const convertWebMToWav = async (webmBlob: Blob): Promise<Blob> => {
    // AudioContextを作成
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    // WebMデータをArrayBufferに変換
    const arrayBuffer = await webmBlob.arrayBuffer();

    // ArrayBufferをデコード
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // WAVデータを作成するためのバッファを用意
    const numberOfChannels = audioBuffer.numberOfChannels;
    const length = audioBuffer.length;
    const sampleRate = audioBuffer.sampleRate;
    const wavBuffer = audioContext.createBuffer(numberOfChannels, length, sampleRate);

    // 各チャンネルのデータをコピー
    for (let channel = 0; channel < numberOfChannels; channel++) {
        const channelData = audioBuffer.getChannelData(channel);
        wavBuffer.copyToChannel(channelData, channel);
    }

    // WAVエンコーディング用の関数
    const encodeWAV = (audioBuffer: AudioBuffer): Blob => {
        const numChannels = audioBuffer.numberOfChannels;
        const sampleRate = audioBuffer.sampleRate;
        const format = 1; // PCM
        const bitDepth = 16;

        const buffer = new ArrayBuffer(44 + audioBuffer.length * numChannels * (bitDepth / 8));
        const view = new DataView(buffer);

        // WAVヘッダーを書き込む
        writeString(view, 0, 'RIFF');
        view.setUint32(4, 36 + audioBuffer.length * numChannels * (bitDepth / 8), true);
        writeString(view, 8, 'WAVE');
        writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, format, true);
        view.setUint16(22, numChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true);
        view.setUint16(32, numChannels * (bitDepth / 8), true);
        view.setUint16(34, bitDepth, true);
        writeString(view, 36, 'data');
        view.setUint32(40, audioBuffer.length * numChannels * (bitDepth / 8), true);

        // オーディオデータを書き込む
        const floatTo16BitPCM = (output: DataView, offset: number, input: Float32Array) => {
            for (let i = 0; i < input.length; i++, offset += 2) {
                const s = Math.max(-1, Math.min(1, input[i]));
                output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
            }
        };

        let offset = 44;
        for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
            floatTo16BitPCM(view, offset, audioBuffer.getChannelData(i));
            offset += audioBuffer.length * 2;
        }

        return new Blob([buffer], { type: 'audio/wav' });
    };

    const writeString = (view: DataView, offset: number, string: string) => {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    };

    return encodeWAV(wavBuffer);
};

export default convertWebMToWav;