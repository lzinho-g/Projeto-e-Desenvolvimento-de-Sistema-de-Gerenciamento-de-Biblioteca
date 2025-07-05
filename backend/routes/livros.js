import express from 'express';
import { listarLivros, cadastrarLivro, excluirLivro } from '../controllers/livrosController.js';

const router = express.Router();

router.get('/', listarLivros);
router.post('/', cadastrarLivro);
router.delete('/:id', excluirLivro);

export default router;
