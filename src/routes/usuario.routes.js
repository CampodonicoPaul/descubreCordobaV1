// usuariosRoutes.js define las rutas relacionadas con usuarios.
// Cada ruta asocia un método HTTP con una función del controller.

import { Router } from 'express';
const router = Router();


import {
    obtener,
    obtenerPorId,
    crear,
    actualizar,
    eliminar,
} from '../controllers/usuario.controller.js';

import { verificarAdmin } from '../middleware/auth.js';

// GET /usuarios -> listar todos los usuarios.
// Solo administradores.
router.get('/', verificarAdmin, obtener);

// GET /usuarios/:id -> ver un usuario específico.
// Solo administradores.
router.get('/:id', verificarAdmin, obtenerPorId);

// POST /usuarios -> crear un nuevo usuario.
// Solo administradores.
router.post('/', verificarAdmin, crear);

// PUT /usuarios/:id -> actualizar un usuario existente.
// Solo administradores.
router.put('/:id', verificarAdmin, actualizar);

// DELETE /usuarios/:id -> eliminar un usuario.
// Solo administradores.
router.delete('/:id', verificarAdmin, eliminar);

export default router;
