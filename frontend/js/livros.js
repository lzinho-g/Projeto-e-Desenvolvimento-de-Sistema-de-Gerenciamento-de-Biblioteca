async function carregarAutores() {
    const select = document.getElementById('bookAuthors');
    select.innerHTML = '';

    try {
        const response = await fetch('http://localhost:3000/api/autores');
        const autores = await response.json();

        autores.forEach(autor => {
            const option = document.createElement('option');
            option.value = autor.id;
            option.textContent = autor.nome;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar autores:', error);
    }
}

async function carregarLivros() {
    const tbody = document.querySelector('#booksTable tbody');
    tbody.innerHTML = '';

    try {
        const response = await fetch('http://localhost:3000/api/livros');
        const livros = await response.json();

        if (livros.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7">Nenhum livro cadastrado.</td></tr>';
            return;
        }

        livros.forEach(livro => {
            const autores = livro.autores.map(a => a.nome).join(', ');
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${livro.isbn}</td>
                <td>${livro.titulo}</td>
                <td>${livro.ano_publicacao}</td>
                <td>${livro.editora}</td>
                <td>${livro.genero}</td>
                <td>${autores}</td>
                <td>
                    <button class="delete-icon-btn delete-btn" title="Excluir">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            `;


            tr.querySelector('.delete-btn').addEventListener('click', () => {
                if (confirm(`Excluir o livro "${livro.titulo}"?`)) {
                    excluirLivro(livro.id);
                }
            });

            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error('Erro ao carregar livros:', error);
    }
}

async function excluirLivro(id) {
    try {
        await fetch(`http://localhost:3000/api/livros/${id}`, { method: 'DELETE' });
        carregarLivros();
    } catch (error) {
        alert('Erro ao excluir livro.');
    }
}

async function handleBookFormSubmit(e) {
    e.preventDefault();

    const isbn = document.getElementById('isbn').value.trim();
    const titulo = document.getElementById('title').value.trim();
    const ano = parseInt(document.getElementById('publicationYear').value);
    const editora = document.getElementById('publisher').value.trim();
    const genero = document.getElementById('genre').value.trim();
    const autoresSelecionados = Array.from(document.getElementById('bookAuthors').selectedOptions)
                                     .map(opt => parseInt(opt.value));

    if (!isbn || !titulo || !ano || !editora || !genero || autoresSelecionados.length === 0) {
        alert('Preencha todos os campos.');
        return;
    }

    const livro = {
        isbn,
        titulo,
        ano_publicacao: ano,
        editora,
        genero,
        autores: autoresSelecionados
    };

    try {
        await fetch('http://localhost:3000/api/livros', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(livro)
        });

        showMessage('Livro salvo com sucesso!');
        document.getElementById('bookForm').reset();
        carregarLivros();
    } catch (error) {
        console.error('Erro ao salvar livro:', error);
        alert('Erro ao salvar livro.');
    }
}

function handleBookSearch(e) {
    const term = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#booksTable tbody tr');
    rows.forEach(row => {
        const texto = row.innerText.toLowerCase();
        row.style.display = texto.includes(term) ? '' : 'none';
    });
}

function clearBookSearch() {
    document.getElementById('bookSearch').value = '';
    carregarLivros();
}

function showMessage(msg) {
    const container = document.getElementById('messageContainer');
    const span = document.getElementById('messageText');
    span.textContent = msg;
    container.style.display = 'block';
    setTimeout(() => { container.style.display = 'none'; }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    carregarAutores();
    carregarLivros();
    document.getElementById('bookForm').addEventListener('submit', handleBookFormSubmit);
    document.getElementById('bookSearch').addEventListener('input', handleBookSearch);
    document.getElementById('clearSearch').addEventListener('click', clearBookSearch);
});
