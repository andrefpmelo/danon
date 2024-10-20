import { getCanvasFingerprint } from './canvasFingerprint.js';
import { getAudioFingerprint } from './audioFingerprint.js';
import { getWebGLFingerprint } from './webGLFingerprint.js';
import { getBatteryFingerprint } from './batteryFingerprint.js';
import { getTCPFingerprint } from './tcpFingerprint.js';
import { getThumbmarkFingerprint } from './thumbmarkFingerprint.js';

let fingerprintData = {};
let selectedIdentifier;
let identifierValue;
// Verificar se as fingerprints já foram enviadas nesta sessão
let fingerprintsSent = sessionStorage.getItem('fingerprintsSent') === 'true';

// Função para exibir os dados na tabela
function displayFingerprints(fingerprintData) {
        function insertIntoSection(sectionId, attribute, value) {
            const section = document.getElementById(sectionId);

            if (section) {
                const row = document.createElement('tr');
                const attributeCell = document.createElement('td');
                const valueCell = document.createElement('td');

                attributeCell.textContent = attribute;
                valueCell.textContent = value !== undefined && value !== null ? value : 'N/A';

                row.appendChild(attributeCell);
                row.appendChild(valueCell);
                section.appendChild(row);
            }
        }

        // Limpar seções antes de exibir novos dados
        const sectionIds = ['thumbmarkData', 'systemData', 'tcpData', 'clientData', 'additionalData'];
        sectionIds.forEach(id => {
            const section = document.getElementById(id);
            // Mantém a linha de título e remove o restante
            section.innerHTML = section.querySelector('.section-title').outerHTML;
        });

        // Exibir os dados
        // Seção ThumbmarkJS Fingerprints
        insertIntoSection('thumbmarkData', 'thumbmarkFingerprint', fingerprintData.thumbmarkFingerprint);
        
        // Navegador e Sistema
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

        // Seção Fingerprints adicionais
        insertIntoSection('additionalData', 'canvasFingerprint', fingerprintData.canvasFingerprint);
        insertIntoSection('additionalData', 'audioFingerprint', fingerprintData.audioFingerprint);
        insertIntoSection('additionalData', 'webGLFingerprint', fingerprintData.webGLFingerprint);
        insertIntoSection('additionalData', 'batteryFingerprint', fingerprintData.batteryFingerprint);

        // Após inserir os dados, configurar os botões de toggle
        setupToggleButtons();
}

function setupToggleButtons() {
        const sections = document.querySelectorAll('tbody.section');

        sections.forEach(section => {
            const titleRow = section.querySelector('.section-title');
            const toggleIcon = titleRow.querySelector('.toggle-icon');

            // Não ocultar as linhas após o título
            const contentRows = section.querySelectorAll('tr:not(.section-title)');
            // Removido o código que oculta as linhas
            toggleIcon.textContent = '-'; // Seções estão expandidas por padrão

            titleRow.addEventListener('click', () => {
                if (contentRows.length > 0) {
                    const isHidden = contentRows[0].style.display === 'none';
                    contentRows.forEach(row => row.style.display = isHidden ? 'table-row' : 'none');
                    toggleIcon.textContent = isHidden ? '-' : '+';
                }
            });
        });
}

// Exibir a mensagem e o botão
function displayMessageAndButton(message, identifierValue, selectedIdentifier) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;

    // Remover botão anterior se existir
    const existingButton = messageElement.querySelector('button');
    if (existingButton) {
        messageElement.removeChild(existingButton);
    }

    // Verifica se a mensagem indica que há registros anteriores
    if (message.includes('Tenho outros registros')) {
        // Criar o botão dinamicamente
        const button = document.createElement('button');
        button.textContent = 'Ver últimas 5 fingerprints';
        button.onclick = () => {
           window.location.href = `/view-records?identifierValue=${identifierValue}&selectedIdentifier=${selectedIdentifier}`;
        };
        messageElement.appendChild(button);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize ClientJS
    const client = new ClientJS();
    
    // Obter o elemento de seleção do identificador
    const identifierSelect = document.getElementById('identifier');
    // Recuperar o identificador selecionado do sessionStorage, se existir
    selectedIdentifier = sessionStorage.getItem('selectedIdentifier') || identifierSelect.value;
    // Atualizar o seletor com o identificador armazenado
    identifierSelect.value = selectedIdentifier;
    
    // Capturar todas as fingerprints
    async function collectFingerprints() {
        console.log('collectFingerprints chamado. fingerprintsSent:', fingerprintsSent);
        if (fingerprintsSent) {
            // As fingerprints já foram enviadas nesta sessão; não enviar novamente
            // Mas precisamos obter os dados para usar ao mudar o identificador
            // Recuperar os dados do sessionStorage
            fingerprintData = JSON.parse(sessionStorage.getItem('fingerprintData')) || {};
            
            // Obter o identificador selecionado e o valor correspondente
            selectedIdentifier = sessionStorage.getItem('selectedIdentifier') || identifierSelect.value;
            identifierSelect.value = selectedIdentifier;
            identifierValue = fingerprintData[selectedIdentifier];
            
            if (identifierValue === undefined) {
                alert('O identificador selecionado não está disponível nos dados coletados.');
                return;
            }
                
            // Exibir as fingerprints na tabela
            displayFingerprints(fingerprintData);

            // Enviar uma requisição ao servidor para verificar o identificador
            fetch('/check-identifier', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ selectedIdentifier, identifierValue })
            })
            .then(response => response.json())
            .then(data => {
                // Atualizar a mensagem e o botão
                displayMessageAndButton(data.message, identifierValue, selectedIdentifier);
            })
            .catch(error => console.error('Erro ao verificar o identificador:', error));

            return;
        }
        
        const thumbmarkFingerprint = await getThumbmarkFingerprint();
        const tcpFingerprint = await getTCPFingerprint();
        const canvasFingerprint = getCanvasFingerprint();
        const audioFingerprint = getAudioFingerprint();
        const webGLFingerprint = getWebGLFingerprint();
        const batteryFingerprint = await getBatteryFingerprint();

        fingerprintData = {
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
            webGLFingerprint: webGLFingerprint ? `Vendor: ${webGLFingerprint.vendor}, Renderer: ${webGLFingerprint.renderer}` : 'Not supported',
            batteryFingerprint: JSON.stringify(batteryFingerprint)
    };
        
     
        // Salvar os dados no sessionStorage para acesso posterior
        sessionStorage.setItem('fingerprintData', JSON.stringify(fingerprintData));

        // Obter o identificador selecionado e o valor correspondente
        selectedIdentifier = identifierSelect.value;
        identifierValue = fingerprintData[selectedIdentifier];
        fingerprintData.selectedIdentifier = selectedIdentifier;
        
        // Armazenar o identificador selecionado no sessionStorage
        sessionStorage.setItem('selectedIdentifier', selectedIdentifier);
        
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
             // Exibir os dados na tabela
            displayFingerprints(fingerprintData);

            // Exibir a mensagem e o botão
            displayMessageAndButton(data.message, identifierValue, selectedIdentifier);

            // Marcar que as fingerprints foram enviadas nesta sessão
            sessionStorage.setItem('fingerprintsSent', 'true');
            fingerprintsSent = true; // Atualizar a variável local
        })
        .catch(error => console.error('Erro ao enviar/verificar fingerprint:', error));
    }
    // Chamar collectFingerprints no carregamento da página
    collectFingerprints();
    
     // Adicionar um listener para o evento de mudança do identificador
    identifierSelect.addEventListener('change', () => {
            selectedIdentifier = identifierSelect.value;
            identifierValue = fingerprintData[selectedIdentifier];
            
            // Armazenar o identificador selecionado no sessionStorage
            sessionStorage.setItem('selectedIdentifier', selectedIdentifier);
            
            if (identifierValue === undefined) {
                alert('O identificador selecionado não está disponível nos dados coletados.');
                return;
            }
            
            // Enviar uma requisição ao servidor para verificar o identificador
            fetch('/check-identifier', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ selectedIdentifier, identifierValue })
            })
            .then(response => response.json())
            .then(data => {
                // Atualizar a mensagem e o botão
                displayMessageAndButton(data.message, identifierValue, selectedIdentifier);
            })
            .catch(error => console.error('Erro ao verificar o identificador:', error));
        });

});

window.addEventListener('pageshow', (event) => {
        if (event.persisted || performance.getEntriesByType('navigation')[0].type === 'back_forward') {
            // A página foi carregada do cache
            fingerprintsSent = sessionStorage.getItem('fingerprintsSent') === 'true';
            selectedIdentifier = document.getElementById('identifier').value;

            collectFingerprints();
        }
});
