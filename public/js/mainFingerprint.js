import { getCanvasFingerprint } from './canvasFingerprint.js';
import { getAudioFingerprint } from './audioFingerprint.js';
import { getWebGLFingerprint } from './webGLFingerprint.js';
import { getBatteryFingerprint } from './batteryFingerprint.js';
import { getTCPFingerprint } from './tcpFingerprint.js';
import { getThumbmarkFingerprint } from './thumbmarkFingerprint.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize ClientJS
    const client = new ClientJS();
    // Capturar todas as fingerprints
    async function collectFingerprints() {
        const thumbmarkFingerprint = await getThumbmarkFingerprint();
        const tcpFingerprint = await getTCPFingerprint();
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

        // Enviar as fingerprints para o backend
        fetch('/submit-fingerprint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(fingerprintData)
        })
        .then(response => response.json())
        .then(data => {
            // Exibir a mensagem retornada pelo servidor
            const messageElement = document.getElementById('message');
            messageElement.textContent = data.message;

            // Exibir os dados na tabela
            displayFingerprints(fingerprintData);
        })
        .catch(error => console.error('Erro ao enviar/verificar fingerprint:', error));
    }

    // Função para exibir os dados na tabela
    function displayFingerprints(fingerprintData) {
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

        // Limpar seções antes de exibir novos dados
        document.getElementById('systemData').innerHTML = '';
        document.getElementById('tcpData').innerHTML = '';
        document.getElementById('clientData').innerHTML = '';
        document.getElementById('thumbmarkData').innerHTML = '';
        document.getElementById('additionalData').innerHTML = '';

        // Exibir os dados
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

        // Seção TCP Fingerprints
        insertIntoSection('tcpData', 'tcpFingerprint', fingerprintData.tcpFingerprint);
        insertIntoSection('tcpData', 'tcpFingerprintMismatch', fingerprintData.tcpFingerprintMismatch);
        insertIntoSection('tcpData', 'clientIP', fingerprintData.clientIP);
        
        // Seção ClientJS Fingerprints
        insertIntoSection('clientData', 'Browser', fingerprintData.browser);
        insertIntoSection('clientData', 'BrowserVersion', fingerprintData.browserVersion);
        insertIntoSection('clientData', 'OS', fingerprintData.os);
        insertIntoSection('clientData', 'Device', fingerprintData.device);
        insertIntoSection('clientData', 'CPU', fingerprintData.cpu);
        insertIntoSection('clientData', 'DeviceType', fingerprintData.deviceType);
        insertIntoSection('clientData', 'DeviceVendor', fingerprintData.deviceVendor);
        insertIntoSection('clientData', 'isMobile', fingerprintData.isMobile);
        insertIntoSection('clientData', 'ClientJS fingerprint', fingerprintData.fingerprint);

        // Seção ThumbmarkJS Fingerprints
        insertIntoSection('thumbmarkData', 'thumbmarkFingerprint', fingerprintData.thumbmarkFingerprint);

        // Seção Fingerprints adicionais
        insertIntoSection('additionalData', 'canvasFingerprint', fingerprintData.canvasFingerprint);
        insertIntoSection('additionalData', 'audioFingerprint', fingerprintData.audioFingerprint);
        insertIntoSection('additionalData', 'webGLFingerprint', fingerprintData.webGLFingerprint);
        insertIntoSection('additionalData', 'batteryFingerprint', fingerprintData.batteryFingerprint);

    }

    // Iniciar a coleta de fingerprints
    collectFingerprints();
});


