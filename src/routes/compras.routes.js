import { Router } from 'express';

import {
    obtener,
    obtenerPorId,
    crear,
    actualizar,
} from '../controllers/compra.controller.js';

import {
    verificarUsuario,
    verificarAdmin,
} from '../middleware/auth.js';

const router = Router();

// Usuario autenticado: ver sus compras.
router.get('/', verificarUsuario, obtener);

// Usuario autenticado: ver una de sus compras.
router.get('/:id', verificarUsuario, obtenerPorId);

// Usuario autenticado: generar una compra desde su carrito.
router.post('/', verificarUsuario, crear);

// Solo administradores: actualizar el estado de una compra.
router.put('/:id', verificarAdmin, actualizar);

export default router;