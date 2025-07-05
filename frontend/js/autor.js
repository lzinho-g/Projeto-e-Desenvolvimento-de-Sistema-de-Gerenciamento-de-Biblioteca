function formatDate(isoDate) {
    if (!isoDate) return '-';
    
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // meses começam em 0
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}


async function loadAuthors() {
    const tbody = document.querySelector('#authorsTable tbody');
    tbody.innerHTML = '';

    try {
        const response = await fetch('http://localhost:3000/api/autores');
        const authors = await response.json();

        if (authors.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4">Nenhum autor cadastrado.</td></tr>';
            return;
        }

        authors.forEach(author => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${author.nome}</td>
                <td>${author.nacionalidade}</td>
                <td>${formatDate(author.data_nascimento)}</td>
                <td>
                    <button class="button danger delete-btn"><i class="fas fa-trash-alt"></i> Excluir</button>
                </td>
            `;
            tr.querySelector('.delete-btn').addEventListener('click', () => {
                if (confirm(`Excluir ${author.nome}?`)) {
                    deleteAuthor(author.id);
                }
            });
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao carregar autores:', error);
        tbody.innerHTML = '<tr><td colspan="4">Erro ao carregar autores.</td></tr>';
    }
}

async function deleteAuthor(id) {
    try {
        await fetch(`http://localhost:3000/api/autores/${id}`, { method: 'DELETE' });
        loadAuthors();
    } catch (error) {
        console.error('Erro ao excluir autor:', error);
        alert('Erro ao excluir autor.');
    }
}

async function handleAuthorFormSubmit(e) {
    e.preventDefault();

    const nome = document.getElementById('name').value.trim();
    const nacionalidade = document.getElementById('nationality').value.trim();
    const data_nascimento = document.getElementById('birthDate').value;
    const biografia = document.getElementById('biography').value.trim();

    if (!nome || !nacionalidade || !data_nascimento) {
        alert('Preencha todos os campos obrigatórios.');
        return;
    }

    const autor = {
        nome,
        nacionalidade,
        data_nascimento,
        biografia,
        foto: '' // opcional — pode adicionar suporte base64 depois
    };

    try {
        await fetch('http://localhost:3000/api/autores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(autor)
        });
        alert('Autor salvo com sucesso!');
        document.getElementById('authorForm').reset();
        loadAuthors();
    } catch (error) {
        console.error('Erro ao salvar autor:', error);
        alert('Erro ao salvar autor.');
    }
}

function handleAuthorSearch(e) {
    const term = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#authorsTable tbody tr');
    rows.forEach(row => {
        const name = row.children[0]?.textContent.toLowerCase();
        row.style.display = name.includes(term) ? '' : 'none';
    });
}

function clearAuthorSearch() {
    document.getElementById('authorSearch').value = '';
    loadAuthors();
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("[autor.js] Página carregada com backend.");
    loadAuthors();
    document.getElementById('authorForm').addEventListener('submit', handleAuthorFormSubmit);
    document.getElementById('authorSearch').addEventListener('input', handleAuthorSearch);
    document.getElementById('clearSearch').addEventListener('click', clearAuthorSearch);
});
