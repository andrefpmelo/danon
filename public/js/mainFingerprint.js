import { getCanvasFingerprint } from './canvasFingerprint.js';
import { getAudioFingerprint } from './audioFingerprint.js';
import { getWebGLFingerprint } from './webGLFingerprint.js';
import { getBatteryFingerprint } from './batteryFingerprint.js';
import { getTCPFingerprint } from './tcpFingerprint.js';
import { getThumbmarkFingerprint } from './thumbmarkFingerprint.js';

document.addEventListener('DOMContentLoaded', async () => {
    const thumbmarkFingerprint = await getThumbmarkFingerprint(); // ThumbmarkJS fingerprint
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

        // Fingerprints adicionais
        canvasFingerprint: canvasFingerprint,
        audioFingerprint: audioFingerprint,
        webGLFingerprint: webGLFingerprint,
        batteryFingerprint: JSON.stringify(batteryFingerprint)
    };

    // Enviar thumbmarkFingerprint para o backend
    fetch(`/check-fingerprint?thumbmarkFingerprint=${thumbmarkFingerprint}`)
        .then(response => response.json())
        .then(data => {
            const messageElement = document.getElementById('message');
            messageElement.textContent = data.message;
        })
        .catch(error => console.error('Erro ao verificar fingerprint:', error));

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
});

