export function getAudioFingerprint() {
    const audioContext = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, 44100, 44100);
    const oscillator = audioContext.createOscillator();
    const analyser = audioContext.createAnalyser();
    oscillator.connect(analyser);
    oscillator.start(0);
    const array = new Float32Array(analyser.frequencyBinCount);
    analyser.getFloatFrequencyData(array);
    let hash = 0;
    for (let i = 0; i < array.length; i++) {
        hash = (hash << 5) - hash + array[i];
        hash = hash & hash;
    }
    return hash.toString();
}

