// js/login.js

// Toggle para mostrar/esconder senha
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

togglePassword.addEventListener('click', () => {
  const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordInput.setAttribute('type', type);
  togglePassword.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
});

document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('password').value.trim();

  const loader = document.getElementById('loginLoader');
  const btnLogin = this.querySelector('.login-button');

  if (!email || !senha) {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  try {
    loader.style.display = 'block';
    btnLogin.disabled = true;

    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();

    loader.style.display = 'none';
    btnLogin.disabled = false;

    if (!response.ok) {
      alert(data.message || 'Credenciais inválidas');
      return;
    }

    // Login bem-sucedido: redireciona para index.html
    window.location.href = 'index.html';

  } catch (error) {
    loader.style.display = 'none';
    btnLogin.disabled = false;
    alert('Erro ao comunicar com o servidor.');
  }
});
