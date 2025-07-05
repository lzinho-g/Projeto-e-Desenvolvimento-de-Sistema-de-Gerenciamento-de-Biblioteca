import express from "express";
import {
  listarEmprestimos,
  cadastrarEmprestimo,
  excluirEmprestimo,
  atualizarStatus 
} from "../controllers/emprestimosController.js";

const router = express.Router();

router.get("/", listarEmprestimos);
router.post("/", cadastrarEmprestimo);
router.delete("/:id", excluirEmprestimo);
router.patch("/:id/status", atualizarStatus); 

export default router;
