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

// GET /usuarios -> listar todos los usuarios.
router.get('/', obtener);

// GET /usuarios/:id -> ver un usuario específico.
router.get('/:id', obtenerPorId);

// POST /usuarios -> crear un nuevo usuario.
router.post('/', crear);

// PUT /usuarios/:id -> actualizar un usuario existente.
router.put('/:id', actualizar);

// DELETE /usuarios/:id -> eliminar un usuario.
router.delete('/:id', eliminar);

export default router;
