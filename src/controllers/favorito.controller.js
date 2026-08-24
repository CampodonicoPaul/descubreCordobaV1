import {Favorito} from '../models/index.js';

// GET /favorito/usuario/:idUsuario
export const obtenerPorUsuario = async (req, res) => {
    try {
        const idUsuario = parseInt(req.params.idUsuario, 10);
        const data = await Favorito.findAll({
            where: { idUsuario }
        });

        res.json({
            estado: true,
            data,
        });
    } catch (error) {
        console.error('Error al obtener favoritos:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al obtener favoritos',
            error: error.message,
        });
    }
};

// GET /favorito/:idUsuario/:idExcursion
export const obtenerPorId = async (req, res) => {
    try {
        const idUsuario = parseInt(req.params.idUsuario, 10);
        const idExcursion = parseInt(req.params.idExcursion, 10);

        const data = await Favorito.findOne({
            where: { idUsuario, idExcursion }
        });

        if (!data) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Favorito no encontrado',
            });
        }

        res.json({
            estado: true,
            data,
        });
    } catch (error) {
        console.error('Error al obtener favorito:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al obtener favorito',
            error: error.message,
        });
    }
};

// POST /favorito
export const crear = async (req, res) => {
    try {
        const idUsuario = parseInt(req.body.idUsuario, 10);
        const idExcursion = parseInt(req.body.idExcursion, 10);

        if (!idUsuario || !idExcursion) {
            return res.status(400).json({
                estado: false,
                mensaje: 'Debes proporcionar idUsuario e idExcursion válidos',
            });
        }

        // Verificar si ya existe para no duplicar
        const existe = await Favorito.findOne({ where: { idUsuario, idExcursion } });
        if (existe) {
            return res.status(400).json({
                estado: false,
                mensaje: 'Esta excursión ya está en favoritos',
            });
        }

        const data = await Favorito.create({ idUsuario, idExcursion });
        res.status(201).json({
            estado: true,
            data,
        });
    } catch (error) {
        console.error('Error al crear favorito:', error);
        res.status(400).json({
            estado: false,
            mensaje: 'Error al crear favorito',
            error: error.message,
        });
    }
};

// DELETE /favorito/:idUsuario/:idExcursion
export const eliminar = async (req, res) => {
    try {
        const idUsuario = parseInt(req.params.idUsuario, 10);
        const idExcursion = parseInt(req.params.idExcursion, 10);

        const filasBorradas = await Favorito.destroy({
            where: { idUsuario, idExcursion }
        });

        if (filasBorradas === 0) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Favorito no encontrado para eliminar',
            });
        }

        res.json({
            estado: true,
            mensaje: 'Favorito eliminado correctamente',
        });
    } catch (error) {
        console.error('Error al eliminar favorito:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al eliminar favorito',
            error: error.message,
        });
    }
};