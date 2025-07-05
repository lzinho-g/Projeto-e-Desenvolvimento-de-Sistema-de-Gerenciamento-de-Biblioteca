import { db } from '../db.js';

export const login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios' });
  }

  try {
    const [rows] = await db.query(
      'SELECT * FROM contas WHERE email = ? AND senha = ?',
      [email, senha]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    return res.json({ message: 'Login bem-sucedido', usuario: rows[0] });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};
