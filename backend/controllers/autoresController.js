import { db } from '../db.js';

export async function getAll(req, res) {
  const [rows] = await db.query('SELECT * FROM autores');
  res.json(rows);
}

export async function create(req, res) {
  const { nome, nacionalidade, data_nascimento, biografia, foto } = req.body;
  const sql = 'INSERT INTO autores (nome, nacionalidade, data_nascimento, biografia, foto) VALUES (?, ?, ?, ?, ?)';
  await db.query(sql, [nome, nacionalidade, data_nascimento, biografia, foto]);
  res.status(201).json({ message: 'Autor criado com sucesso' });
}

export async function remove(req, res) {
  const { id } = req.params;
  await db.query('DELETE FROM autores WHERE id = ?', [id]);
  res.json({ message: 'Autor removido com sucesso' });
}
