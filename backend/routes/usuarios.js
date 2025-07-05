import express from 'express';
import {
  listarUsuarios,
  cadastrarUsuario,
  excluirUsuario,
} from '../controllers/usuariosController.js';

const router = express.Router();

router.get('/', listarUsuarios);
router.post('/', cadastrarUsuario);
router.delete('/:id', excluirUsuario);

export default router;
