const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/fingerprintDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Conectado ao MongoDB via Docker!'))
.catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Definir o mecanismo de visualização EJS
app.set('view engine', 'ejs');

// Definir o caminho das views
app.set('views', path.join(__dirname, 'views'));

// Definir o esquema de fingerprint
const fingerprintSchema = new mongoose.Schema({
    // Fingerprint gerado pelo ThumbmarkJS
    thumbmarkFingerprint: String,
    // Fingerprints de navegador e sistema
    userAgent: String,
    language: String,
    platform: String,
    screenResolution: String,
    colorDepth: String,
    timezone: String,
    cookiesEnabled: Boolean,
    cpuCores: Number,
    onlineStatus: String,
    localStorage: String,
    sessionStorage: String,
    windowSize: String,
    touchSupport: String,
    pluginsInstalled: String,
    canvasFingerprint: String,
    
    // Campos relacionados ao TCP Fingerprint
    tcpFingerprint: String,
    tcpFingerprintMismatch: Boolean,
    clientIP: String,

    // Dados adicionais coletados pelo ClientJS
    browser: String,
    browserVersion: String,
    os: String,
    device: String,
    cpu: String,
    deviceType: String,
    deviceVendor: String,
    isMobile: Boolean,
    fingerprint: String, // ID gerado pelo ClientJS

    // Fingerprints adicionais
    audioFingerprint: String,
    webGLFingerprint: String,
    batteryFingerprint: String,

    timestamp: { type: Date, default: Date.now }
});

fingerprintSchema.index({ thumbmarkFingerprint: 1 });
fingerprintSchema.index({ clientIP: 1 });
fingerprintSchema.index({ fingerprint: 1 });
fingerprintSchema.index({ canvasFingerprint: 1 });

// Criar o modelo Fingerprint
const Fingerprint = mongoose.model('Fingerprint', fingerprintSchema);

// Middleware para servir arquivos estáticos (CSS, JavaScript, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para analisar o JSON no corpo da requisição
app.use(express.json());

// GET route to serve the HTML page and render the view
app.get('/', (req, res) => {
    res.render('index', { title: 'Fingerprint Data', message: '' });
});

// Rota principal para capturar fingerprints e verificar registros prévios
app.post('/submit-fingerprint', async (req, res) => {
    let message = "Esse é seu primeiro acesso";
    const selectedIdentifier = req.body.selectedIdentifier;
    const identifierValue = req.body[selectedIdentifier];
    const validIdentifiers = ['thumbmarkFingerprint', 'clientIP', 'fingerprint', 'canvasFingerprint'];
    if (!validIdentifiers.includes(selectedIdentifier)) {
        return res.status(400).json({ message: 'Identificador inválido' });
    }

    try {
        // Salvar as fingerprints no banco de dados
        const newFingerprint = new Fingerprint(req.body);
        await newFingerprint.save();

        // Verificar se há registros anteriores com o mesmo identificador
        const count = await Fingerprint.countDocuments({ [selectedIdentifier]: identifierValue });
        
        if (count > 1) {  // Se for maior que 1, já há outros registros
            message = `Tenho outros registros na minha base de dados para o identificador "${selectedIdentifier}" com valor "${identifierValue}"`;
        }
    } catch (error) {
        console.error('Erro ao buscar fingerprint no banco de dados:', error);
    }

    // Retornar a mensagem com ou sem registros anteriores
    res.json({ message, identifierValue, selectedIdentifier });
});


// Rota para exibir as últimas 5 fingerprints do usuário
app.get('/view-records', async (req, res) => {
    const selectedIdentifier = req.query.selectedIdentifier;
    const identifierValue = req.query.identifierValue;

    try {
        // Buscar as últimas 5 fingerprints com o mesmo identificador
        const fingerprints = await Fingerprint.find({ [selectedIdentifier]: identifierValue })
                                              .sort({ timestamp: -1 })
                                              .limit(5);

        // Renderizar a página com os registros encontrados
        res.render('view-records', {
            fingerprints: fingerprints,
            selectedIdentifier: selectedIdentifier,
            identifierValue: identifierValue
        });
    } catch (error) {
        console.error('Erro ao buscar as últimas 5 fingerprints:', error);
        res.status(500).send('Erro ao buscar registros');
    }
});


// Iniciar o servidor na porta 3000
const PORT = process.env.PORT || 3000;
const HOST = '192.168.5.193';  // Definir o IP no qual o servidor vai escutar

app.listen(PORT, HOST, () => {
    console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});

