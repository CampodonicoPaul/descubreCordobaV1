import { Router } from 'express';
import {
    crearUsuarioAdmin,
    obtenerUsuariosAdmin,
    obtenerUsuarioAdminPorId,
    actualizarUsuarioAdmin,
    eliminarUsuarioAdmin
} from '../controllers/usuarioAdmin.controller.js';

const router = Router();

router.post('/', crearUsuarioAdmin);
router.get('/', obtenerUsuariosAdmin);
router.get('/:id', obtenerUsuarioAdminPorId);
router.put('/:id', actualizarUsuarioAdmin);
router.delete('/:id', eliminarUsuarioAdmin);

export default router;