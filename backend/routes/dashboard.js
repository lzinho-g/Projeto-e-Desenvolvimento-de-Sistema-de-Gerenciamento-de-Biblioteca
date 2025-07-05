import express from 'express';
import { getDashboardData, getLivrosRecentes } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/dados', getDashboardData);
router.get('/livros-recentes', getLivrosRecentes);

export default router;
