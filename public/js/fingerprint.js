document.addEventListener('DOMContentLoaded', () => {
    // Função para gerar o fingerprint baseado em canvas
    function getCanvasFingerprint() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Desenhar no canvas
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillStyle = 'red';
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = 'white';
        ctx.fillText('Fingerprinting!', 2, 15);
        ctx.strokeStyle = 'blue';
        ctx.arc(12, 37, 12, 0, Math.PI * 2, true);
        ctx.stroke();

        // Capturar a imagem e gerar hash
        const canvasData = canvas.toDataURL();
        let hash = 0;
        for (let i = 0; i < canvasData.length; i++) {
            const char = canvasData.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        console.log('Canvas Fingerprint:', hash);
        return hash.toString();
    }

    // Função para obter TCP Fingerprint via Zardaxt API
    async function getTCPFingerprint() {
        try {
            const response = await fetch('http://172.20.10.5:8249/classify?detail=1');  // Atualizado para o IP correto
            const data = await response.json();
            console.log('Resposta da API Zardaxt:', data);
            if (!data.details) {
                console.error('Nenhum detalhe encontrado na resposta da API');
                return { os: 'Unknown', os_mismatch: false, client_ip: 'Unknown' };
            }
            return {
                os: data.details.os_highest_class || 'Unknown',
                os_mismatch: data.details.os_mismatch || false,
                client_ip: data.details.client_ip || 'Unknown'
            };
        } catch (error) {
            console.error('Erro ao obter TCP Fingerprint:', error);
            return { os: 'Unknown', os_mismatch: false, client_ip: 'Unknown' };
        }
    }

    // Função para coletar todos os fingerprints e enviar ao servidor
    async function collectFingerprints() {
        const tcpFingerprint = await getTCPFingerprint();

        const fingerprintData = {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            colorDepth: `${window.screen.colorDepth}-bit`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            cookiesEnabled: navigator.cookieEnabled,
            cpuCores: navigator.hardwareConcurrency || null,
            onlineStatus: navigator.onLine ? 'Online' : 'Offline',
            localStorage: typeof localStorage !== 'undefined' ? 'Supported' : 'Not supported',
            sessionStorage: typeof sessionStorage !== 'undefined' ? 'Supported' : 'Not supported',
            windowSize: `${window.innerWidth}x${window.innerHeight}`,
            touchSupport: 'ontouchstart' in window ? 'Supported' : 'Not supported',
            pluginsInstalled: navigator.plugins.length > 0 ? Array.from(navigator.plugins).map(plugin => plugin.name).join(', ') : 'No plugins',
            canvasFingerprint: getCanvasFingerprint(),
            tcpFingerprint: tcpFingerprint.os,
            tcpFingerprintMismatch: tcpFingerprint.os_mismatch,
            clientIP: tcpFingerprint.client_ip
        };

        console.log('Fingerprint Data Final:', fingerprintData);

        // Adicionar os dados de fingerprint na tabela
        const tableBody = document.getElementById('fingerprintData');
        if (!tableBody) {
            console.error('Elemento da tabela não encontrado!');
            return;
        }

        for (let [attribute, value] of Object.entries(fingerprintData)) {
            const row = document.createElement('tr');
            const attributeCell = document.createElement('td');
            const valueCell = document.createElement('td');

            attributeCell.textContent = attribute;
            valueCell.textContent = value;

            row.appendChild(attributeCell);
            row.appendChild(valueCell);
            tableBody.appendChild(row);
        }

        // Enviar os dados de fingerprint para o servidor
        fetch('/submit-fingerprint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(fingerprintData)
        })
        .then(response => response.json())
        .then(data => console.log('Fingerprint armazenado com sucesso:', data))
        .catch(error => console.error('Erro ao enviar fingerprint:', error));
    }

    // Iniciar a coleta de fingerprints
    collectFingerprints();
});
