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

// Definir o esquema de fingerprint
const fingerprintSchema = new mongoose.Schema({
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

    // Fingerprint gerado pelo ThumbmarkJS
    thumbmarkFingerprint: String,

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

// Criar o modelo Fingerprint
const Fingerprint = mongoose.model('Fingerprint', fingerprintSchema);

// Middleware para servir arquivos estáticos (CSS, JavaScript, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para analisar o JSON no corpo da requisição
app.use(express.json());

// Configurar o mecanismo de visualização EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Nova rota para verificar a fingerprint no banco de dados
app.get('/check-fingerprint', async (req, res) => {
    let message = "Esse é seu primeiro acesso";
    const thumbmarkFingerprint = req.query.thumbmarkFingerprint;

    try {
        if (thumbmarkFingerprint) {
            const count = await Fingerprint.countDocuments({ thumbmarkFingerprint: thumbmarkFingerprint });
            if (count > 0) {
                message = `Tenho outros registros na minha base de dados para a fingerprint ${thumbmarkFingerprint}`;
            }
        }
    } catch (error) {
        console.error('Erro ao buscar fingerprint no banco de dados:', error);
    }

    // Retornar a mensagem como JSON
    res.json({ message });
});




// Rota principal para servir a página inicial
app.get('/', async (req, res) => {
    let message = "Esse é seu primeiro acesso";
    const thumbmarkFingerprint = req.query.thumbmarkFingerprint || ''; // Obtém a fingerprint, ou vazio se não houver	
    //alert(thumbmarkFingerprint);
    try {
        // Buscar no MongoDB se já existe uma thumbmarkFingerprint
        
        if (thumbmarkFingerprint) {
            const count = await Fingerprint.countDocuments({ thumbmarkFingerprint: thumbmarkFingerprint });
            if (count > 0) {
                // Se já existir um registro, altere a mensagem
                message = `Tenho outros registros na minha base de dados para a fingerprint ${thumbmarkFingerprint}`;
            }
        }
    } catch (error) {
        console.error('Erro ao buscar fingerprint no banco de dados:', error);
    }

    // Renderizar a página com a mensagem
    res.render('index', { title: 'Fingerprint Data', message });
});

// Rota para salvar o fingerprint no MongoDB
app.post('/submit-fingerprint', async (req, res) => {
    try {
        // Criar e salvar o fingerprint no MongoDB
        const newFingerprint = new Fingerprint(req.body);
        await newFingerprint.save();
        res.status(201).json({ message: 'Fingerprint salvo com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao salvar fingerprint', error });
    }
});

// Iniciar o servidor na porta 3000
const PORT = process.env.PORT || 3000;
const HOST = '192.168.5.193';  // Definir o IP no qual o servidor vai escutar

app.listen(PORT, HOST, () => {
    console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});
