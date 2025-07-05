import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './db.js';

import autoresRoutes from './routes/autores.js';
import livrosRoutes from './routes/livros.js';
import usuariosRoutes from './routes/usuarios.js';
import emprestimosRoutes from './routes/emprestimos.js';
import dashboardRoutes from './routes/dashboard.js'; 
import loginRoutes from './routes/login.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/autores', autoresRoutes);
app.use('/api/livros', livrosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/emprestimos', emprestimosRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/login', loginRoutes); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
