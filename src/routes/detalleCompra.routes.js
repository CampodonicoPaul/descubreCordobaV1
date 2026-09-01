import { Router } from 'express';

import {
    obtener,
    obtenerPorId,
} from '../controllers/detalleCompra.controller.js';

import { verificarUsuario } from '../middleware/auth.js';

const router = Router();

// Usuario autenticado: ver los detalles de sus propias compras.
router.get('/', verificarUsuario, obtener);

// Usuario autenticado: ver un detalle de una de sus compras.
router.get('/:id', verificarUsuario, obtenerPorId);

export default router;