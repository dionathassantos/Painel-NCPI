require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const path = require('path');
const jwt = require('jsonwebtoken'); // Adiciona a biblioteca jsonwebtoken

const app = express(); // Inicializa o Express

const SECRET_KEY = process.env.SECRET_KEY || 'algumaChaveSuperSecretaAquiParaJWT'; // Substitua por uma chave secreta segura

// Parse JSON from the FIREBASE_CONFIG environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://ncpi-102ca-default-rtdb.firebaseio.com'
});

const db = admin.database();

const PORT = process.env.PORT || 3000;

// Middleware
const allowedOrigins = [
    'http://127.0.0.1:5500',
    'http://localhost:5550',
    'https://painel-ncpi-io.onrender.com'
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Permitir envio de cookies, se necessário
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'] // Cabeçalhos permitidos
}));

// Responder a requisições OPTIONS (preflight)
app.options('*', cors());

app.use(bodyParser.json());

// Serve arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public'))); // Certifique-se de que 'public' é o diretório correto

// Ajusta a rota raiz para servir o login.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Ajusta a rota para o index.html
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Middleware para autenticar o token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) return res.status(401).json({ message: 'Token não fornecido.' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token inválido ou expirado.' });
        req.user = user;
        next();
    });
}

// Rota de Registro 
app.post('/api/register', async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Criptografa a senha
        const usersRef = db.ref('users');
        usersRef.orderByChild('email').equalTo(email).once('value', (snapshot) => {
            if (snapshot.exists()) {
                res.status(400).json({ message: 'E-mail já registrado.' });
            } else {
                const newUserRef = usersRef.push();
                newUserRef.set({ fullName, email, password: hashedPassword });
                res.status(201).json({ message: 'Usuário registrado com sucesso!' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
});

// Rota de Login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const usersRef = db.ref('users');
        usersRef.orderByChild('email').equalTo(email).once('value', async (snapshot) => {
            if (snapshot.exists()) {
                const userData = Object.values(snapshot.val())[0];
                const isPasswordValid = await bcrypt.compare(password, userData.password); // Verifica a senha
                if (isPasswordValid) {
                    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' }); // Gera o token com validade de 1 hora
                    console.log('Token gerado:', token); // Log para depuração
                    res.status(200).json({ 
                        message: 'Login bem-sucedido!', 
                        token // Inclui o token na resposta
                    });
                } else {
                    res.status(401).json({ message: 'Senha incorreta.' });
                }
            } else {
                res.status(404).json({ message: 'Usuário não encontrado.' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
});

// Rota para validar o token
app.get('/api/verify-token', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'Token válido!', user: req.user });
});

// Rota protegida de exemplo
app.get('/api/protected', authenticateToken, (req, res) => {
    res.json({ message: 'Acesso autorizado.', user: req.user });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
