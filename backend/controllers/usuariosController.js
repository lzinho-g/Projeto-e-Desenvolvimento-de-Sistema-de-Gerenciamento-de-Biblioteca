import { db } from '../db.js';

// Listar todos os usuários
export async function listarUsuarios(req, res) {
  try {
    const [usuarios] = await db.query('SELECT * FROM usuarios ORDER BY nome');
    res.json(usuarios);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar usuários' });
  }
}

// Cadastrar novo usuário
export async function cadastrarUsuario(req, res) {
  const { nome, email, cpf, telefone, endereco, tipo, status, foto } = req.body;

  try {
    await db.query(`
      INSERT INTO usuarios (nome, email, cpf, telefone, endereco, tipo, status, foto)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [nome, email, cpf, telefone, endereco, tipo, status, foto]);

    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao cadastrar usuário', detalhes: err.message });
  }
}

// Excluir usuário por ID
export async function excluirUsuario(req, res) {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM usuarios WHERE id = ?', [id]);
    res.json({ mensagem: 'Usuário excluído com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao excluir usuário' });
  }
}
