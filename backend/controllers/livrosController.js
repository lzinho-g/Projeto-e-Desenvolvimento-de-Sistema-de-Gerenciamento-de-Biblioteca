import { db } from '../db.js'; // seu db.js está exportando como db

export async function listarLivros(req, res) {
  try {
    const [livros] = await db.query('SELECT * FROM livros');

    for (const livro of livros) {
      const [autores] = await db.query(`
        SELECT a.id, a.nome FROM autores a
        JOIN livros_autores la ON la.autor_id = a.id
        WHERE la.livro_id = ?
      `, [livro.id]);
      livro.autores = autores;
    }

    res.json(livros);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao listar livros' });
  }
}

export async function cadastrarLivro(req, res) {
  const { isbn, titulo, ano_publicacao, editora, genero, autores } = req.body;

  try {
    const [resultado] = await db.query(
      'INSERT INTO livros (isbn, titulo, ano_publicacao, editora, genero) VALUES (?, ?, ?, ?, ?)',
      [isbn, titulo, ano_publicacao, editora, genero]
    );

    const livroId = resultado.insertId;

    for (const autorId of autores) {
      await db.query('INSERT INTO livros_autores (livro_id, autor_id) VALUES (?, ?)', [livroId, autorId]);
    }

    res.status(201).json({ mensagem: 'Livro cadastrado com sucesso' });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao cadastrar livro', detalhes: erro.message });
  }
}

export async function excluirLivro(req, res) {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM livros_autores WHERE livro_id = ?', [id]);
    await db.query('DELETE FROM livros WHERE id = ?', [id]);

    res.json({ mensagem: 'Livro excluído com sucesso' });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao excluir livro' });
  }
}
