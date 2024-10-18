export async function getThumbmarkFingerprint() {
    try {
        const thumbmarkFingerprint = await ThumbmarkJS.getFingerprint();
        return thumbmarkFingerprint;
    } catch (error) {
        return 'Unknown';
    }
}

