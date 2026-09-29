import { Router } from 'express';
import {
    obtenerPorUsuario,
    crear,
    eliminar
} from '../controllers/favorito.controller.js'; 
import { verificarUsuario } from '../middleware/auth.js';

const router = Router();

router.use(verificarUsuario);

router.get('/', obtenerPorUsuario);

router.post('/', crear);

router.delete('/:idExcursion', eliminar);

export default router;