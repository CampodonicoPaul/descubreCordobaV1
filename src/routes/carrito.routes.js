import { Router } from 'express';
import {
    obtener,
    obtenerPorId,
    crear,
    actualizar,
    eliminar,
} from '../controllers/carrito.controller.js';

const router = Router();

// Rutas públicas (para la vista principal/e-commerce)
router.get('/', obtener);
router.get('/:id', obtenerPorId);

// Rutas protegidas (solo administradores)
router.post('/', crear);
router.put('/:id', actualizar);
router.delete('/:id', eliminar);

export default router;