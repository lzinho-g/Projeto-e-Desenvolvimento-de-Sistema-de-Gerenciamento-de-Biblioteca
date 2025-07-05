// ✅ Funções auxiliares
function aplicarMascaraCPF(valor) {
    valor = valor.replace(/\D/g, "").slice(0, 11);
    return valor.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, (m, p1, p2, p3, p4) => {
        return `${p1}.${p2}.${p3}-${p4}`.replace(/[-.]$/, "");
    });
}

function aplicarMascaraTelefone(valor) {
    valor = valor.replace(/\D/g, "").slice(0, 11);
    if (valor.length <= 10) {
        return valor.replace(/(\d{2})(\d{4})(\d{0,4})/, (m, p1, p2, p3) => `(${p1}) ${p2}-${p3}`.replace(/-$/, ""));
    } else {
        return valor.replace(/(\d{2})(\d{5})(\d{0,4})/, (m, p1, p2, p3) => `(${p1}) ${p2}-${p3}`.replace(/-$/, ""));
    }
}

// ✅ Carregar usuários da API e preencher a tabela
async function carregarUsuarios() {
    const tbody = document.querySelector("#usersTable tbody");
    tbody.innerHTML = "";

    try {
        const resposta = await fetch("http://localhost:3000/api/usuarios");
        const usuarios = await resposta.json();

        if (usuarios.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8">Nenhum usuário cadastrado.</td></tr>';
            return;
        }

        usuarios.forEach((usuario) => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td><div class="user-avatar"><img src="${usuario.foto || "img/default-profile.jpg"}" alt="Foto"></div></td>
                <td>${usuario.nome} <small>(${usuario.cpf})</small></td>
                <td><span class="user-type ${usuario.tipo}">${usuario.tipo}</span></td>
                <td>${usuario.email}</td>
                <td>${usuario.telefone}</td>
                <td><span class="status ${usuario.status}">${usuario.status}</span></td>
                <td>${new Date(usuario.data_cadastro).toLocaleDateString()}</td>
                <td>
                    <button class="icon-button danger delete-button" data-id="${usuario.id}" title="Excluir"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;

            tbody.appendChild(tr);
        });

        document.querySelectorAll(".delete-button").forEach((btn) => {
            btn.addEventListener("click", async () => {
                const id = btn.getAttribute("data-id");
                if (confirm("Tem certeza que deseja excluir este usuário?")) {
                    try {
                        await fetch(`http://localhost:3000/api/usuarios/${id}`, {
                            method: "DELETE",
                        });
                        carregarUsuarios();
                    } catch (erro) {
                        console.error("Erro ao excluir usuário:", erro);
                        alert("Erro ao excluir usuário.");
                    }
                }
            });
        });

    } catch (erro) {
        console.error("Erro ao carregar usuários:", erro);
        tbody.innerHTML = '<tr><td colspan="8">Erro ao carregar usuários.</td></tr>';
    }
}

// ✅ Inicialização do formulário e eventos
document.addEventListener("DOMContentLoaded", () => {
    carregarUsuarios();

    const userForm = document.getElementById("userForm");
    const fileInput = document.getElementById("userPhotoInput");
    const fileName = document.getElementById("fileName");
    const base64Input = document.getElementById("userPhotoBase64");
    const fotoPreview = document.getElementById("userPhotoPreview");

    const cpfInput = document.getElementById("userCpf");
    const phoneInput = document.getElementById("userPhone");

    cpfInput.addEventListener("input", () => {
        cpfInput.value = aplicarMascaraCPF(cpfInput.value);
    });

    phoneInput.addEventListener("input", () => {
        phoneInput.value = aplicarMascaraTelefone(phoneInput.value);
    });

    fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                base64Input.value = reader.result;
                fileName.textContent = file.name;
                if (fotoPreview) fotoPreview.src = reader.result;
            };
            reader.readAsDataURL(file);
        }
    });

    userForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const novoUsuario = {
            tipo: document.getElementById("userType").value,
            status: document.getElementById("userStatus").value,
            nome: document.getElementById("userName").value,
            email: document.getElementById("userEmail").value,
            cpf: document.getElementById("userCpf").value,
            telefone: document.getElementById("userPhone").value,
            endereco: document.getElementById("userAddress").value,
            foto: document.getElementById("userPhotoBase64").value,
        };

        try {
            await fetch("http://localhost:3000/api/usuarios", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(novoUsuario),
            });

            alert("Usuário cadastrado com sucesso!");
            userForm.reset();
            fileName.textContent = "Nenhum arquivo selecionado";
            if (fotoPreview) fotoPreview.src = "img/default-profile.jpg";
            carregarUsuarios();
        } catch (erro) {
            console.error("Erro ao cadastrar usuário:", erro);
            alert("Erro ao cadastrar usuário.");
        }
    });
});
