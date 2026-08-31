import { Router } from 'express';

import {
    obtener,
    obtenerPorId,
    crear,
    actualizar,
    eliminar,
} from '../controllers/carrito.controller.js';

import { verificarUsuario } from '../middleware/auth.js';

const router = Router();

// Todas las operaciones del carrito requieren un usuario autenticado.
router.get('/', verificarUsuario, obtener);
router.get('/:id', verificarUsuario, obtenerPorId);

router.post('/', verificarUsuario, crear);
router.put('/:id', verificarUsuario, actualizar);
router.delete('/:id', verificarUsuario, eliminar);

export default router;