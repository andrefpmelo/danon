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
    const thumbmarkFingerprint = req.body.thumbmarkFingerprint;

    try {
        // Primeiro, salvar as fingerprints no banco de dados
        const newFingerprint = new Fingerprint(req.body);
        await newFingerprint.save();

        // Depois de salvar, verificar se há registros anteriores com a mesma fingerprint
        const count = await Fingerprint.countDocuments({ thumbmarkFingerprint: thumbmarkFingerprint });
        // Debug
        //console.log(`Número de registros com a thumbmarkFingerprint ${thumbmarkFingerprint}:`, count);
        
        if (count > 1) {  // Se for maior que 1, significa que já há outros registros
            message = `Tenho outros registros na minha base de dados para a fingerprint ${thumbmarkFingerprint}`;
        }
    } catch (error) {
        console.error('Erro ao buscar fingerprint no banco de dados:', error);
    }

    // Retornar a mensagem com ou sem registros anteriores
    res.json({ message, thumbmarkFingerprint });
});

// Nova rota para exibir as últimas 5 fingerprints do usuário
app.get('/view-records', async (req, res) => {
    const thumbmarkFingerprint = req.query.thumbmarkFingerprint;

    try {
        // Buscar as últimas 5 fingerprints com o mesmo thumbmarkFingerprint, ordenadas por data de criação
        const fingerprints = await Fingerprint.find({ thumbmarkFingerprint: thumbmarkFingerprint })
                                              .sort({ timestamp: -1 })
                                              .limit(5);

        // Renderizar uma nova página com os registros encontrados
        res.render('view-records', { fingerprints: fingerprints, thumbmarkFingerprint: thumbmarkFingerprint });
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

