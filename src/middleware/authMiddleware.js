import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ auth: false, message: 'Token não fornecido.' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'sua_chave_secreta';
    const payload = jwt.verify(token, secret);
    req.userId = payload.userId;
    next();
  } catch (error) {
    return res.status(401).json({ auth: false, message: 'Token inválido.' });
  }
}
