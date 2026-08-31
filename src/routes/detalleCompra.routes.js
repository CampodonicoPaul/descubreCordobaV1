import { Router } from 'express';

import {
    obtener,
    obtenerPorId,
    crear,
    actualizar,
    eliminar,
} from '../controllers/detalleCompra.controller.js';

import { verificarAdmin } from '../middleware/auth.js';

const router = Router();

// Rutas públicas (para la vista principal/e-commerce)
router.get('/', obtener);
router.get('/:id', obtenerPorId);

// Rutas protegidas (solo administradores)
router.post('/', verificarAdmin, crear);
router.put('/:id', verificarAdmin, actualizar);
router.delete('/:id', verificarAdmin, eliminar);

export default router;