import { Excursion } from '../models/index.js';

// GET /excursiones
export const obtener = async (req, res) => {
    try {
        const data = await Excursion.findAll();
        res.json({
            estado: true,
            data,
        });
    } catch (error) {
        console.error('Error al obtener excursiones:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al obtener excursiones',
            error: error.message,
        });
    }
};

// GET /excursiones/:id
export const obtenerPorId = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const data = await Excursion.findByPk(id);

        if (!data) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Excursión no encontrada',
            });
        }

        res.json({
            estado: true,
            data,
        });
    } catch (error) {
        console.error('Error al obtener excursión:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al obtener excursión',
            error: error.message,
        });
    }
};

// POST /excursiones
export const crear = async (req, res) => {
    try {
        const data = await Excursion.create(req.body);
        res.status(201).json({
            estado: true,
            data,
        });
    } catch (error) {
        console.error('Error al crear excursión:', error);
        res.status(400).json({
            estado: false,
            mensaje: 'Error al crear excursión',
            error: error.message,
        });
    }
};

// PUT /excursiones/:id
export const actualizar = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const excursion = await Excursion.findByPk(id);

        if (!excursion) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Excursión no encontrada',
            });
        }

        await excursion.update(req.body);
        res.json({
            estado: true,
            data: excursion,
        });
    } catch (error) {
        console.error('Error al actualizar excursión:', error);
        res.status(400).json({
            estado: false,
            mensaje: 'Error al actualizar excursión',
            error: error.message,
        });
    }
};

// DELETE /excursiones/:id
export const eliminar = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const excursion = await Excursion.findByPk(id);

        if (!excursion) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Excursión no encontrada',
            });
        }

        await excursion.destroy();
        res.json({
            estado: true,
            mensaje: 'Excursión eliminada correctamente',
        });
    } catch (error) {
        console.error('Error al eliminar excursión:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al eliminar excursión',
            error: error.message,
        });
    }
};