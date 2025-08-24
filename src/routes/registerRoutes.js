import express from 'express';
import { prisma } from '../utils/db.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Endpoint para cadastro de usuário inicial
router.post('/', async (req, res) => {
    const { email, senha } = req.body;
    if (!email || !senha) {
        return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }
    try {
        // Verifica se já existe usuário com esse e-mail
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: 'E-mail já cadastrado.' });
        }
        // Criptografa a senha
        const hashedPassword = await bcrypt.hash(senha, 10);
        const novoUsuario = await prisma.user.create({
            data: { email, senha: hashedPassword }
        });
        res.status(201).json({ message: 'Usuário cadastrado com sucesso!', user: { id: novoUsuario.id, email: novoUsuario.email } });
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
    }
});

export default router;
