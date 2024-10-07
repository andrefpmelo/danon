document.addEventListener('DOMContentLoaded', () => {
    // Initialize ClientJS
    const client = new ClientJS();

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
        return hash.toString();
    }

   function getAudioFingerprint() {
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

function getWebGLFingerprint() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return 'Not supported';
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    return `Vendor: ${vendor}, Renderer: ${renderer}`;
}

async function getBatteryFingerprint() {
    if (navigator.getBattery) {
        const battery = await navigator.getBattery();
        return {
            level: battery.level,
            charging: battery.charging
        };
    }
    return 'Battery API not supported';
}

    // Função para obter TCP Fingerprint via Zardaxt API
    async function getTCPFingerprint() {
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

    // Função para coletar fingerprints usando ThumbmarkJS
    async function getThumbmarkFingerprint() {
        try {
            const thumbmarkFingerprint = await ThumbmarkJS.getFingerprint();
            return thumbmarkFingerprint;
        } catch (error) {
            return 'Unknown';
        }
    }

    // Função para coletar todos os fingerprints e enviar ao servidor
async function collectFingerprints() {
    const tcpFingerprint = await getTCPFingerprint();
    const thumbmarkFingerprint = await getThumbmarkFingerprint();
    console.log('Thumbmark Fingerprint:', thumbmarkFingerprint);
    const canvasFingerprint = getCanvasFingerprint();
    const audioFingerprint = getAudioFingerprint();
    const webGLFingerprint = getWebGLFingerprint();
    const batteryFingerprint = await getBatteryFingerprint();

    const fingerprintData = {
        // Navegador e Sistema
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

        // TCP Fingerprint
        tcpFingerprint: tcpFingerprint.os,
        tcpFingerprintMismatch: tcpFingerprint.os_mismatch,
        clientIP: tcpFingerprint.client_ip,

        // ThumbmarkJS Fingerprint
        thumbmarkFingerprint: thumbmarkFingerprint,

        // Dados adicionais do ClientJS
        browser: client.getBrowser() || 'Unknown',
        browserVersion: client.getBrowserVersion() || 'Unknown',
        os: client.getOS() || 'Unknown',
        device: client.getDevice() || 'Unknown',
        cpu: client.getCPU() || 'Unknown',
        deviceType: client.getDeviceType() || 'Desktop',
        deviceVendor: client.getDeviceVendor() || 'Unknown Vendor',
        isMobile: client.isMobile() || false,
        fingerprint: client.getFingerprint() || 'Unknown',

        // Fingerprints adicionais
        canvasFingerprint: canvasFingerprint,
        audioFingerprint: audioFingerprint,
        webGLFingerprint: webGLFingerprint,
        batteryFingerprint: JSON.stringify(batteryFingerprint)

	
    };
    // Esconder a mensagem até receber a resposta
    const messageElement = document.getElementById('message');
    messageElement.textContent = ''; // Mantém vazio até a resposta do servidor

     // Enviar a fingerprint via fetch sem redirecionar
    fetch(`/check-fingerprint?thumbmarkFingerprint=${fingerprintData.thumbmarkFingerprint}`)
        .then(response => response.json())
        .then(data => {
            // Exibir a mensagem retornada pelo servidor
            const messageElement = document.getElementById('message');
            messageElement.textContent = data.message;
        })
        .catch(error => console.error('Erro ao verificar fingerprint:', error));

        // Função para inserir dados na seção específica
        function insertIntoSection(sectionId, attribute, value) {
            const section = document.getElementById(sectionId);
            const row = document.createElement('tr');
            const attributeCell = document.createElement('td');
            const valueCell = document.createElement('td');

            attributeCell.textContent = attribute;
            valueCell.textContent = value;

            row.appendChild(attributeCell);
            row.appendChild(valueCell);
            section.appendChild(row);
        }

        // Limpar as seções antes de preencher
        document.getElementById('systemData').innerHTML = '';
    	document.getElementById('tcpData').innerHTML = '';
    	document.getElementById('clientData').innerHTML = '';
     	document.getElementById('thumbmarkData').innerHTML = '';
    	document.getElementById('additionalData').innerHTML = '';

        // Seção 1: Navegador e Sistema
        insertIntoSection('systemData', 'userAgent', fingerprintData.userAgent);
        insertIntoSection('systemData', 'language', fingerprintData.language);
        insertIntoSection('systemData', 'platform', fingerprintData.platform);
        insertIntoSection('systemData', 'screenResolution', fingerprintData.screenResolution);
        insertIntoSection('systemData', 'colorDepth', fingerprintData.colorDepth);
        insertIntoSection('systemData', 'timezone', fingerprintData.timezone);
        insertIntoSection('systemData', 'cookiesEnabled', fingerprintData.cookiesEnabled);
        insertIntoSection('systemData', 'cpuCores', fingerprintData.cpuCores);
        insertIntoSection('systemData', 'onlineStatus', fingerprintData.onlineStatus);
        insertIntoSection('systemData', 'localStorage', fingerprintData.localStorage);
        insertIntoSection('systemData', 'sessionStorage', fingerprintData.sessionStorage);
        insertIntoSection('systemData', 'windowSize', fingerprintData.windowSize);
        insertIntoSection('systemData', 'touchSupport', fingerprintData.touchSupport);
        insertIntoSection('systemData', 'pluginsInstalled', fingerprintData.pluginsInstalled);

        // Seção 2: TCP Fingerprints
        insertIntoSection('tcpData', 'tcpFingerprint', fingerprintData.tcpFingerprint);
        insertIntoSection('tcpData', 'tcpFingerprintMismatch', fingerprintData.tcpFingerprintMismatch);
        insertIntoSection('tcpData', 'clientIP', fingerprintData.clientIP);

        // Seção 3: ClientJS Fingerprints
        insertIntoSection('clientData', 'browser', fingerprintData.browser);
        insertIntoSection('clientData', 'browserVersion', fingerprintData.browserVersion);
        insertIntoSection('clientData', 'os', fingerprintData.os);
        insertIntoSection('clientData', 'device', fingerprintData.device);
        insertIntoSection('clientData', 'cpu', fingerprintData.cpu);
        insertIntoSection('clientData', 'deviceType', fingerprintData.deviceType);
        insertIntoSection('clientData', 'deviceVendor', fingerprintData.deviceVendor);
        insertIntoSection('clientData', 'isMobile', fingerprintData.isMobile);
        insertIntoSection('clientData', 'fingerprint (ClientJS)', fingerprintData.fingerprint);

        // Seção 4: Thumbmark Fingerprints
        insertIntoSection('thumbmarkData', 'thumbmarkFingerprint', fingerprintData.thumbmarkFingerprint);

	// Outros

	 // Adicionar esses novos dados à tabela no frontend
         insertIntoSection('additionalData', 'canvasFingerprint', fingerprintData.canvasFingerprint);
         insertIntoSection('additionalData', 'audioFingerprint', fingerprintData.audioFingerprint);
         insertIntoSection('additionalData', 'webGLFingerprint', fingerprintData.webGLFingerprint);
         insertIntoSection('additionalData', 'batteryFingerprint', fingerprintData.batteryFingerprint);



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
