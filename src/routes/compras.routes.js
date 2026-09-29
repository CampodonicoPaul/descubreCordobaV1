import { Router } from 'express';

import {
    obtener,
    obtenerTodas,
    obtenerPorId,
    crear,
    actualizar,
} from '../controllers/compra.controller.js';

import {
    verificarUsuario,
    verificarAdmin,
    verificarRolAdmin,
} from '../middleware/auth.js';

const router = Router();

// Usuario autenticado: ver sus compras.
router.get('/', verificarUsuario, obtener);

// Administradores: consultar todas las compras.
router.get('/admin', verificarAdmin, obtenerTodas);

// Usuario autenticado: ver una de sus compras.
router.get('/:id', verificarUsuario, obtenerPorId);

// Usuario autenticado: generar una compra desde su carrito.
router.post('/', verificarUsuario, crear);

// Solo administradores: actualizar el estado de una compra.
router.put('/:id', verificarAdmin, verificarRolAdmin, actualizar);

export default router;