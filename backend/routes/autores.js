import express from 'express';
import * as autoresController from '../controllers/autoresController.js';

const router = express.Router();

router.get('/', autoresController.getAll);
router.post('/', autoresController.create);
router.delete('/:id', autoresController.remove);

export default router;
