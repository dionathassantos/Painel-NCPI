const express = require('express');
const bcrypt = require('bcryptjs');

const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const path = require('path');
const jwt = require('jsonwebtoken'); // Adiciona a biblioteca jsonwebtoken

const SECRET_KEY = process.env.SECRET_KEY || 'algumaChaveSuperSecretaAquiParaJWT'; // Substitua por uma chave secreta segura

// Inicializa o Firebase Admin SDK
const serviceAccount = require('./backend/firebase-service-account.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://ncpi-102ca-default-rtdb.firebaseio.com', // Substitua pelo URL correto do seu Firebase Realtime Database
});

const db = admin.database();
const app = express();

const PORT = 3000;

// Middleware
const allowedOrigins = ['http://127.0.0.1:5500', 'http://localhost:5550']; // Add all allowed origins here
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

// Serve arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public'))); // Certifique-se de que 'public' é a pasta correta

// Ajusta a rota raiz para servir o login.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Ajusta a rota para o index.html
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

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
app.get('/api/verify-token', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extrai o token do cabeçalho Authorization

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido.' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY); // Verifica o token
        res.status(200).json({ message: 'Token válido.', decoded });
    } catch (error) {
        console.error('Erro ao verificar token:', error);
        res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
