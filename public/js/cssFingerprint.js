export async function getCSSFingerprint() {
    try {
        const response = await fetch('/proxy-css-fingerprint', {
            method: 'GET'
        });

        if (!response.ok) {
            console.error('Erro na requisição CSS Fingerprint:', response.statusText);
            return null;
        }

        const fingerprint = await response.text();
        return fingerprint;
    } catch (error) {
        console.error('Erro ao obter CSS Fingerprint:', error);
        return null;
    }
}
