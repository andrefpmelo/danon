export function getCanvasFingerprint() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Configurações e desenho no canvas
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = 'red';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = 'white';
    ctx.fillText('Fingerprinting!', 2, 15);
    ctx.strokeStyle = 'blue';
    ctx.arc(12, 37, 12, 0, Math.PI * 2, true);
    ctx.stroke();

    // Obter os dados dos pixels
    const pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    // Calcular o hash a partir dos dados dos pixels
    let hash = 0;
    for (let i = 0; i < pixelData.length; i++) {
        hash = ((hash << 5) - hash) + pixelData[i];
        hash = hash & 0xFFFFFFFF; // Limita o hash a 32 bits
    }

    return hash.toString();
}

