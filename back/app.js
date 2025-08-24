
const { PrismaClient } = require('@prisma/client');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const prisma = new PrismaClient();
const PORT = 3001;
const SECRET = 'sua_chave_secreta';

app.use(cors());
app.use(express.json());

// Rotas de Redes
app.get('/redes', async (req, res) => {
  const redes = await prisma.rede.findMany();
  res.json(redes);
});

app.post('/redes', async (req, res) => {
  const { rede, descricao, tipo } = req.body;
  const novaRede = await prisma.rede.create({ data: { rede, descricao, tipo } });
  res.status(201).json(novaRede);
});

app.put('/redes/:id', async (req, res) => {
  const { id } = req.params;
  const { rede, descricao, tipo } = req.body;
  const redeAtualizada = await prisma.rede.update({
    where: { id: Number(id) },
    data: { rede, descricao, tipo },
  });
  res.json(redeAtualizada);
});

app.delete('/redes/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.rede.delete({ where: { id: Number(id) } });
  res.status(204).end();
});

// Rotas de Ativos
app.get('/ativos', async (req, res) => {
  const ativos = await prisma.ativo.findMany();
  res.json(ativos);
});

app.post('/ativos', async (req, res) => {
  const { ip, mac, descricao, redeId } = req.body;
  const novoAtivo = await prisma.ativo.create({ data: { ip, mac, descricao, redeId: Number(redeId) } });
  res.status(201).json(novoAtivo);
});

app.delete('/ativos/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.ativo.delete({ where: { id: Number(id) } });
  res.status(204).end();
});

app.get('/', (req, res) => {
  res.send('API Express.js funcionando!');
});

// Registro de usuário
app.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: { email, password: hash, name },
    });
    res.status(201).json({ id: user.id, email: user.email, name: user.name });
  } catch (e) {
    res.status(400).json({ error: 'Usuário já existe ou dados inválidos.' });
  }
});

// Login de usuário
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Credenciais inválidas.' });
  }
  const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '1h' });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

// Middleware de autenticação
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token não fornecido.' });
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, SECRET);
    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido.' });
  }
}

// Exemplo de rota protegida
app.get('/profile', auth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
  res.json({ id: user.id, email: user.email, name: user.name });
});

app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});
