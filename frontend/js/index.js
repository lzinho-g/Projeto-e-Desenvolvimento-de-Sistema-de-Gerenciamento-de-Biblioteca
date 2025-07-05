document.addEventListener("DOMContentLoaded", () => {
  carregarDashboard();
  carregarLivrosRecentes();
});

async function carregarDashboard() {
  try {
    const res = await fetch("http://localhost:3000/api/dashboard/dados");
    const data = await res.json();

    document.getElementById("totalLivros").textContent = data.total_livros;
    document.getElementById("totalAutores").textContent = data.total_autores;
    document.getElementById("emprestimosAtivos").textContent = data.emprestimos_ativos;
  } catch (error) {
    console.error("Erro ao carregar dados do dashboard:", error);
  }
}

async function carregarLivrosRecentes() {
  try {
    const res = await fetch("http://localhost:3000/api/dashboard/livros-recentes");
    const livros = await res.json();

    const container = document.getElementById("recentBooks");
    container.innerHTML = "";

    livros.forEach(livro => {
      const card = document.createElement("div");
      card.classList.add("book-card");

      card.innerHTML = `
        <h3>${livro.titulo}</h3>
        <p><strong>Autores:</strong> ${livro.autores}</p>
      `;

      container.appendChild(card);
    });
  } catch (error) {
    console.error("Erro ao carregar livros recentes:", error);
  }
}
