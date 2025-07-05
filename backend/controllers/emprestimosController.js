import { db } from '../db.js';

// 🔍 Listar todos os empréstimos com nome + CPF do usuário e título do livro
export const listarEmprestimos = async (req, res) => {
  try {
    const [emprestimos] = await db.query(`
      SELECT 
        e.id,
        u.nome AS nome_usuario,
        u.cpf AS cpf_usuario,
        l.titulo AS titulo_livro,
        e.data_emprestimo,
        e.data_devolucao,
        e.status,
        e.observacao
      FROM emprestimos e
      JOIN usuarios u ON e.usuario_id = u.id
      JOIN livros l ON e.livro_id = l.id
      ORDER BY e.data_emprestimo DESC
    `);
    res.json(emprestimos);
  } catch (error) {
    console.error("Erro ao listar empréstimos:", error);
    res.status(500).json({ erro: "Erro ao listar empréstimos", detalhes: error.message });
  }
};

// ➕ Cadastrar novo empréstimo
export const cadastrarEmprestimo = async (req, res) => {
  const {
    livro_id,
    usuario_id,
    data_emprestimo,
    data_devolucao,
    observacao
  } = req.body;

  const status = req.body.status || 'ativo'; // padrão = ativo

  if (!livro_id || !usuario_id || !data_emprestimo || !data_devolucao) {
    return res.status(400).json({ erro: "Campos obrigatórios ausentes." });
  }

  try {
    await db.query(
      `INSERT INTO emprestimos 
       (livro_id, usuario_id, data_emprestimo, data_devolucao, status, observacao)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [livro_id, usuario_id, data_emprestimo, data_devolucao, status, observacao]
    );
    res.status(201).json({ mensagem: "Empréstimo cadastrado com sucesso!" });
  } catch (error) {
    console.error("Erro ao cadastrar empréstimo:", error);
    res.status(500).json({ erro: "Erro ao cadastrar empréstimo", detalhes: error.message });
  }
};

// ❌ Excluir empréstimo
export const excluirEmprestimo = async (req, res) => {
  const { id } = req.params;

  try {
    const [resultado] = await db.query(`DELETE FROM emprestimos WHERE id = ?`, [id]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Empréstimo não encontrado." });
    }

    res.json({ mensagem: "Empréstimo excluído com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir empréstimo:", error);
    res.status(500).json({ erro: "Erro ao excluir empréstimo", detalhes: error.message });
  }
};

// ✏️ Atualizar status do empréstimo
export const atualizarStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["ativo", "devolvido", "atrasado"].includes(status)) {
    return res.status(400).json({ erro: "Status inválido. Use: ativo, devolvido ou atrasado." });
  }

  try {
    const [resultado] = await db.query(
      `UPDATE emprestimos SET status = ? WHERE id = ?`,
      [status, id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Empréstimo não encontrado." });
    }

    res.json({ mensagem: "Status atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    res.status(500).json({ erro: "Erro ao atualizar status", detalhes: error.message });
  }
};
