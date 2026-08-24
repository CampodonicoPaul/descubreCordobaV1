import { Router } from 'express';
import {
    obtenerPorUsuario,
    obtenerPorId,
    crear,
    eliminar
} from '../controllers/favorito.controller.js'; 

const router = Router();

router.get('/usuario/:idUsuario', obtenerPorUsuario);

router.get('/:idUsuario/:idExcursion', obtenerPorId);

router.post('/', crear);

router.delete('/:idUsuario/:idExcursion', eliminar);

export default router;