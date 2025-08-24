// Controller para dashboard de redes
import { prisma } from '../utils/db.js';

// Exibe o dashboard (pode ser uma lista de redes ou um resumo)
export async function getDashboard(req, res) {
    try {
        const redes = await prisma.rede.findMany();
        res.json(redes);
    } catch (error) {
        console.error('Erro ao buscar redes:', error);
        res.status(500).json({ error: 'Erro ao buscar redes' });
    }
}

// Adiciona uma nova rede
export async function addRede(req, res) {
    const { rede, descricao, tipo } = req.body;
    if (!rede || !descricao || !tipo) {
        return res.status(400).json({ error: 'Dados obrigatórios faltando.' });
    }
    try {
        const novaRede = await prisma.rede.create({ data: { rede, descricao, tipo } });
        res.status(201).json(novaRede);
    } catch (error) {
        console.error('Erro ao adicionar rede:', error);
        res.status(500).json({ error: 'Erro ao adicionar rede' });
    }
}

// Remove uma rede
export async function deleteRede(req, res) {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ error: 'ID da rede não informado.' });
    }
    try {
        await prisma.rede.delete({ where: { id: Number(id) } });
        res.status(204).end();
    } catch (error) {
        console.error('Erro ao remover rede:', error);
        res.status(500).json({ error: 'Erro ao remover rede' });
    }
}
