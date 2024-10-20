// Define a URL do serviço
const TCP_FINGERPRINT_URL = 'http://192.168.5.193:8249/classify?detail=1';

export async function getTCPFingerprint() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // Timeout de 5 segundos

    try {
        const response = await fetch(TCP_FINGERPRINT_URL, { signal: controller.signal });
        clearTimeout(timeoutId);
        const data = await response.json();
        if (!data.details) {
            return { os: 'Unknown', os_mismatch: false, client_ip: 'Unknown' };
        }
        return {
            os: data.details.os_highest_class || 'Unknown',
            os_mismatch: data.details.os_mismatch || false,
            client_ip: data.details.client_ip || 'Unknown'
        };
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error('Requisição de TCP Fingerprint expirou');
        } else {
            console.error('Erro ao obter TCP Fingerprint:', error);
        }
        return { os: 'Unknown', os_mismatch: false, client_ip: 'Unknown' };
    }
}

