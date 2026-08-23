import { Router } from 'express';
import { verificarAdmin } from '../middleware/auth.js';
import {
    obtener,
    obtenerPorId,
    crear,
    actualizar,
    eliminar,
} from '../controllers/excursiones.controller.js';

const router = Router();

// Un solo middleware verifica token, tipo, rol y carga el usuario.
router.use(verificarAdmin)

// Rutas públicas
router.get('/', obtener);
router.get('/:id', obtenerPorId);

// Rutas protegidas (solo administradores)
router.post('/', verificarAdmin, crear);
router.put('/:id', verificarAdmin, actualizar);
router.delete('/:id', verificarAdmin, eliminar);

export default router;