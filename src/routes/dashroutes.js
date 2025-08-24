import express from 'express';
import { prisma } from '../utils/db.js';
import { getDashboard, addRede, deleteRede } from '../controllers/dashboardController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Listar ativos de uma rede
router.get('/ativos/:redeId', async (req, res) => {
  const { redeId } = req.params;
  try {
    const ativos = await prisma.ativo.findMany({ where: { redeId: Number(redeId) } });
    res.json(ativos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar ativos.' });
  }
});

// Incluir ativo em uma rede
router.post('/ativos', authenticateToken, async (req, res) => {
  const { ip, mac, descricao, redeId } = req.body;
  if (!ip || !mac || !descricao || !redeId) {
    return res.status(400).json({ error: 'Dados obrigatórios faltando.' });
  }
  try {
    const novoAtivo = await prisma.ativo.create({ data: { ip, mac, descricao, redeId: Number(redeId) } });
    res.status(201).json(novoAtivo);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar ativo.' });
  }
});

// Excluir todos os ativos de uma rede
router.delete('/ativos/excluir-todos/:redeId', authenticateToken, async (req, res) => {
  const { redeId } = req.params;
  try {
    await prisma.ativo.deleteMany({ where: { redeId: Number(redeId) } });
    res.json({ message: 'Todos os ativos excluídos.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir ativos.' });
  }
});




// Dashboard principal
router.get('/dashboard', getDashboard);

// Compatível com frontend: retorna todas as redes
router.get('/redes', getDashboard);

// Adicionar endereço de rede
router.post('/add-rede', addRede);

// Remover endereço de rede
router.post('/delete-rede', deleteRede);

// Buscar todas as redes (protegido)
router.get('/get-redes', authenticateToken, async (req, res) => {
    try {
      const redes = await prisma.rede.findMany();
      res.json(redes);
    } catch (error) {
      console.error('Erro ao buscar redes:', error);
      res.status(500).json({ error: 'Erro ao buscar redes' });
    }
});



export default router;
