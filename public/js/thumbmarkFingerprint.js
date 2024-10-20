export async function getThumbmarkFingerprint() {
    if (typeof ThumbmarkJS === 'undefined') {
        console.error('ThumbmarkJS não está disponível');
        return 'Unknown';
    }

    const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => resolve('Unknown (timeout)'), 5000); // Timeout de 5 segundos
    });
    
    try {
         const thumbmarkFingerprint = await Promise.race([
            ThumbmarkJS.getFingerprint(),
            timeoutPromise
        ]);
        return thumbmarkFingerprint;
    } catch (error) {
        console.error('Erro ao obter ThumbmarkJS Fingerprint:', error);
        return 'Unknown';
    }
}

