const API_URL = "http://localhost:3000/api";

document.addEventListener("DOMContentLoaded", () => {
    carregarEmprestimos();
    carregarLivros();
    carregarUsuarios();

    const loanForm = document.getElementById("loanForm");
    loanForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const novoEmprestimo = {
            livro_id: document.getElementById("livroSelect").value,
            usuario_id: document.getElementById("usuarioSelect").value,
            data_emprestimo: document.getElementById("loanDate").value,
            data_devolucao: document.getElementById("returnDate").value,
            status: "ativo",
            observacao: document.getElementById("notes").value
        };

        try {
            const resposta = await fetch(`${API_URL}/emprestimos`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(novoEmprestimo)
            });

            if (resposta.ok) {
                alert("Empréstimo registrado com sucesso!");
                loanForm.reset();
                carregarEmprestimos();
            } else {
                const erro = await resposta.text();
                console.error("Erro ao cadastrar:", erro);
                alert("Erro ao registrar empréstimo.");
            }
        } catch (error) {
            console.error("Erro ao registrar empréstimo:", error);
            alert("Erro ao registrar empréstimo.");
        }
    });
});

async function carregarEmprestimos() {
    const tbody = document.querySelector("#loansTable tbody");
    tbody.innerHTML = "";

    try {
        const resposta = await fetch(`${API_URL}/emprestimos`);
        const emprestimos = await resposta.json();

        if (!emprestimos.length) {
            tbody.innerHTML = `<tr><td colspan="6">Nenhum empréstimo registrado.</td></tr>`;
            return;
        }

        emprestimos.forEach(emp => {
            const tr = document.createElement("tr");
            const nomeCpf = `${emp.nome_usuario} (${emp.cpf_usuario})`;
            const statusFormatado = emp.status.charAt(0).toUpperCase() + emp.status.slice(1);

            tr.innerHTML = `
                <td>${emp.titulo_livro}</td>
                <td>${nomeCpf}</td>
                <td>${formatarData(emp.data_emprestimo)}</td>
                <td>${formatarData(emp.data_devolucao)}</td>
                <td>
                    <span class="status-text ${emp.status}">${emp.status.toUpperCase()}</span>
                </td>
                <td>
                    <button class="icon-button edit-btn" data-id="${emp.id}" title="Editar status">
                    <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button class="icon-button danger delete-btn" data-id="${emp.id}" title="Excluir">
                    <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
                `;

            tbody.appendChild(tr);
        });

        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                excluirEmprestimo(id);
            });
        });

        document.querySelectorAll(".edit-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = btn.getAttribute("data-id");
                const container = e.target.closest("td");
                exibirOpcoesStatus(id, container);
            });
        });

    } catch (error) {
        console.error("Erro ao carregar empréstimos:", error);
        tbody.innerHTML = `<tr><td colspan="6">Erro ao carregar os dados.</td></tr>`;
    }
}

function exibirOpcoesStatus(id, container) {
    // Remove qualquer menu aberto
    document.querySelectorAll(".status-menu").forEach(el => el.remove());

    // Garante que o container tenha position: relative
    container.style.position = "relative";

    // Cria menu dropdown
    const menu = document.createElement("div");
    menu.classList.add("status-menu");
    menu.innerHTML = `
        <button data-status="ativo">Ativo</button>
        <button data-status="devolvido">Devolvido</button>
        <button data-status="atrasado">Atrasado</button>
    `;

    container.appendChild(menu);
    menu.querySelector("button").focus(); // Acessibilidade

    // Eventos dos botões do menu
    menu.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", async () => {
            const novoStatus = btn.getAttribute("data-status");
            await atualizarStatusEmprestimo(id, novoStatus);
            menu.remove();
            carregarEmprestimos();
        });
    });

    // Fechar o menu clicando fora
    const fecharMenu = (e) => {
        if (!menu.contains(e.target)) {
            menu.remove();
            document.removeEventListener("click", fecharMenu);
        }
    };

    setTimeout(() => {
        document.addEventListener("click", fecharMenu);
    }, 0);
}


async function atualizarStatusEmprestimo(id, novoStatus) {
    try {
        const resposta = await fetch(`${API_URL}/emprestimos/${id}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: novoStatus })
        });

        if (!resposta.ok) throw new Error("Erro ao atualizar status.");
    } catch (error) {
        console.error("Erro ao atualizar status:", error);
        alert("Erro ao atualizar status.");
    }
}

async function excluirEmprestimo(id) {
    if (!confirm("Tem certeza que deseja excluir este empréstimo?")) return;

    try {
        const resposta = await fetch(`${API_URL}/emprestimos/${id}`, {
            method: "DELETE"
        });

        if (resposta.ok) {
            carregarEmprestimos();
        } else {
            alert("Erro ao excluir empréstimo.");
        }
    } catch (error) {
        console.error("Erro ao excluir empréstimo:", error);
        alert("Erro ao excluir empréstimo.");
    }
}

function formatarData(dataISO) {
    const data = new Date(dataISO);
    return data.toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

async function carregarLivros() {
    const livroSelect = document.getElementById("livroSelect");
    if (!livroSelect) return;

    try {
        const resposta = await fetch(`${API_URL}/livros`);
        const livros = await resposta.json();

        livros.forEach(livro => {
            const option = document.createElement("option");
            option.value = livro.id;
            option.textContent = livro.titulo;
            livroSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Erro ao carregar livros:", error);
    }
}

async function carregarUsuarios() {
    const usuarioSelect = document.getElementById("usuarioSelect");
    if (!usuarioSelect) return;

    try {
        const resposta = await fetch(`${API_URL}/usuarios`);
        const usuarios = await resposta.json();

        usuarios.forEach(usuario => {
            const option = document.createElement("option");
            option.value = usuario.id;
            option.textContent = `${usuario.nome} (${usuario.cpf})`;
            usuarioSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Erro ao carregar usuários:", error);
    }
}
