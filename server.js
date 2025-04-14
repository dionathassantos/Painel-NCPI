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
app.use(cors({
    origin: (origin, callback) => {.onrender.com', // Permitir apenas o domínio do frontend
        const allowedOrigins = [ir envio de cookies, se necessário
            'http://127.0.0.1:5500','DELETE', 'OPTIONS'], // Métodos permitidos
            'http://localhost:5550', 'Authorization'] // Cabeçalhos permitidos
            'https://painel-ncpi-io.onrender.com'
        ];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },ve arquivos estáticos da pasta 'public'
    credentials: true, // Permitir envio de cookies, se necessárioique-se de que 'public' é o diretório correto
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'] // Cabeçalhos permitidos
}));get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
// Responder a requisições OPTIONS (preflight)
app.options('*', cors());
// Ajusta a rota para o index.html
app.use(bodyParser.json());, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
// Serve arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public'))); // Certifique-se de que 'public' é o diretório correto
// Middleware para autenticar o token
// Ajusta a rota raiz para servir o login.html
app.get('/', (req, res) => { 'production') {eaders['authorization'];
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});     if (req.headers['x-forwarded-proto'] !== 'https') {
            return res.redirect(`https://${req.headers.host}${req.url}`);    if (!token) return res.status(401).json({ message: 'Token não fornecido.' });
// Ajusta a rota para o index.html
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});   req.user = user;
        next();
// Middleware para autenticar o tokenogin.html
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];in.html'));
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
app.post('/api/register', async (req, res) => {
    if (!token) return res.status(401).json({ message: 'Token não fornecido.' });
app.get('/index.html', (req, res) => {
    jwt.verify(token, SECRET_KEY, (err, user) => {ndex.html'));
        if (err) return res.status(403).json({ message: 'Token inválido ou expirado.' });
        req.user = user;
        next();ara autenticar o tokenf.orderByChild('email').equalTo(email).once('value', (snapshot) => {
    });n authenticateToken(req, res, next) {     if (snapshot.exists()) {
}   const authHeader = req.headers['authorization'];               res.status(400).json({ message: 'E-mail já registrado.' });
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN            } else {
// Rota de Registro Ref.push();
app.post('/api/register', async (req, res) => {essage: 'Token não fornecido.' });l, password: hashedPassword });
    const { fullName, email, password } = req.body;
    jwt.verify(token, SECRET_KEY, (err, user) => {            }
    try {f (err) return res.status(403).json({ message: 'Token inválido ou expirado.' }););
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
        });st hashedPassword = await bcrypt.hash(password, 10); // Criptografa a senha
    } catch (error) {f = db.ref('users');f = db.ref('users');
        console.error(error);('email').equalTo(email).once('value', (snapshot) => {('email').equalTo(email).once('value', async (snapshot) => {
        res.status(500).json({ message: 'Erro no servidor.' });
    }           res.status(400).json({ message: 'E-mail já registrado.' });           const userData = Object.values(snapshot.val())[0];
});         } else {             const isPasswordValid = await bcrypt.compare(password, userData.password); // Verifica a senha
                const newUserRef = usersRef.push();                if (isPasswordValid) {
// Rota de LoginnewUserRef.set({ fullName, email, password: hashedPassword });    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' }); // Gera o token com validade de 1 hora
app.post('/api/login', async (req, res) => {ge: 'Usuário registrado com sucesso!' });o:', token); // Log para depuração
    const { email, password } = req.body;
        });                        message: 'Login bem-sucedido!', 
    try {ch (error) {               token // Inclui o token na resposta
        const usersRef = db.ref('users');
        usersRef.orderByChild('email').equalTo(email).once('value', async (snapshot) => {
            if (snapshot.exists()) {a.' });
                const userData = Object.values(snapshot.val())[0];
                const isPasswordValid = await bcrypt.compare(password, userData.password); // Verifica a senha
                if (isPasswordValid) { encontrado.' });
                    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' }); // Gera o token com validade de 1 hora
                    console.log('Token gerado:', token); // Log para depuração
                    res.status(200).json({ 
                        message: 'Login bem-sucedido!', 
                        token // Inclui o token na resposta
                    });yChild('email').equalTo(email).once('value', async (snapshot) => {
                } else {.exists()) {
                    res.status(401).json({ message: 'Senha incorreta.' });
                }onst isPasswordValid = await bcrypt.compare(password, userData.password); // Verifica a senhadar o token
            } else {isPasswordValid) {-token', authenticateToken, (req, res) => {
                res.status(404).json({ message: 'Usuário não encontrado.' });: '1h' }); // Gera o token com validade de 1 hora verificar se a rota foi acessada
            }       console.log('Token gerado:', token); // Log para depuraçãoog("Token no header:", req.headers.authorization); // Log para verificar o token recebido no cabeçalho
        });         res.status(200).json({ 
    } catch (error) {   message: 'Login bem-sucedido!', son({ message: 'Token válido!', user: req.user });
        console.error(error); // Inclui o token na resposta
        res.status(500).json({ message: 'Erro no servidor.' });
    }           } else {ta protegida de exemplo
});                 res.status(401).json({ message: 'Senha incorreta.' });.get('/api/protected', authenticateToken, (req, res) => {
                }    res.json({ message: 'Acesso autorizado.', user: req.user });
// Rota para validar o token
app.get('/api/verify-token', authenticateToken, (req, res) => {contrado.' });
    console.log("Requisição recebida para verificação do token"); // Log para verificar se a rota foi acessada
    console.log("Token no header:", req.headers.authorization); // Log para verificar o token recebido no cabeçalho
    } catch (error) {    console.log(`Servidor rodando na porta ${PORT}`);
    res.status(200).json({ message: 'Token válido!', user: req.user });
});     res.status(500).json({ message: 'Erro no servidor.' });    }});// Rota para validar o tokenapp.get('/api/verify-token', authenticateToken, (req, res) => {    console.log("Requisição recebida para verificação do token"); // Log para verificar se a rota foi acessada    console.log("Token no header:", req.headers.authorization); // Log para verificar o token recebido no cabeçalho    res.status(200).json({ message: 'Token válido!', user: req.user });});
// Rota protegida de exemplo
// Rota protegida de exemplothenticateToken, (req, res) => {
app.get('/api/protected', authenticateToken, (req, res) => { });
    res.json({ message: 'Acesso autorizado.', user: req.user });
});
// Inicia o servidor
// Inicia o servidor=> {
app.listen(PORT, () => {r rodando na porta ${PORT}`);
    console.log(`Servidor rodando na porta ${PORT}`);
});