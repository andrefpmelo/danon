export function getCanvasFingerprint() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = 'red';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = 'white';
    ctx.fillText('Fingerprinting!', 2, 15);
    ctx.strokeStyle = 'blue';
    ctx.arc(12, 37, 12, 0, Math.PI * 2, true);
    ctx.stroke();

    const canvasData = canvas.toDataURL();
    let hash = 0;
    for (let i = 0; i < canvasData.length; i++) {
        const char = canvasData.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    return hash.toString();
}

