import { db } from '../db.js'; // ✅ Certo: importa a conexão criada com createConnection

export const getDashboardData = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM livros) AS total_livros,
        (SELECT COUNT(*) FROM autores) AS total_autores,
        (SELECT COUNT(*) FROM emprestimos WHERE status = 'ativo') AS emprestimos_ativos
    `);
    res.json(rows[0]);
  } catch (err) {
    console.error("Erro ao buscar dados do dashboard:", err);
    res.status(500).send("Erro interno");
  }
};

export const getLivrosRecentes = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT l.id, l.titulo, GROUP_CONCAT(a.nome SEPARATOR ', ') AS autores
      FROM livros l
      JOIN livros_autores la ON l.id = la.livro_id
      JOIN autores a ON la.autor_id = a.id
      GROUP BY l.id
      ORDER BY l.id DESC
      LIMIT 5;
    `);
    res.json(rows);
  } catch (err) {
    console.error("Erro ao buscar livros recentes:", err);
    res.status(500).send("Erro interno");
  }
};

