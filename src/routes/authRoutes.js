import express from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/db.js';

const router = express.Router();

// Rota de login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'sua_chave_secreta', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao autenticar.' });
    }
});

export default router;
