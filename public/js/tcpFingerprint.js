export async function getTCPFingerprint() {
    try {
        const response = await fetch('http://192.168.5.193:8249/classify?detail=1');
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
        return { os: 'Unknown', os_mismatch: false, client_ip: 'Unknown' };
    }
}

