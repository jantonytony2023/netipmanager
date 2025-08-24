
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dashboardRoutes from './src/routes/dashroutes.js';
import authRoutes from './src/routes/authRoutes.js';
import registerRoutes from './src/routes/registerRoutes.js';
import { connectDB } from './src/utils/db.js';
import 'dotenv/config';


// Necessário para __dirname funcionar com ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parse de JSON e dados de formulário
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

import { authenticateToken } from './src/middleware/authMiddleware.js';

// Rotas do dashboard (endereços de rede)
app.use('/dashboard/api', dashboardRoutes);

// Rota de dashboard (HTML) protegida
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/dashboard.html'));
});

// Rotas de autenticação (login)
app.use('/auth', authRoutes);


// Rota principal: exibe a landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/index.html'));
});

// Rota de login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/views/login.html'));
});

// Conectar ao banco de dados
connectDB();

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// -----------------------------
// Comentários explicativos:
// - express: framework web para Node.js
// - path: manipulação de caminhos de arquivos
// - fileURLToPath: para usar __dirname em ES Modules
// - dashboardRoutes: rotas do dashboard (endereços de rede)
// - connectDB: conecta ao banco de dados Prisma
// - dotenv/config: carrega variáveis de ambiente do .env
// - app.use(express.json()): permite receber JSON no body
// - app.use(express.static(...)): serve arquivos estáticos (css, js, imagens)
// - app.listen: inicia o servidor na porta definida
