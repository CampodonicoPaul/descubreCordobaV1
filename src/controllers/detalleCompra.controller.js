import DetalleCompra from "../models/detalleCompra.model.js";

// GET /detalleCompras
export const obtener = async (req, res) => {
    try {
        const data = await DetalleCompra.findAll();
        res.json({
            estado: true,
            data,
        });
    } catch (error) {
        console.error('Error al obtener detalle de la compra:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al obtener detalle de la compra',
            error: error.message,
        });
    }
};

// GET /detalleCompra/:id
export const obtenerPorId = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const data = await DetalleCompra.findByPk(id);

        if (!data) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Detalle de compra no encontrada',
            });
        }

        res.json({
            estado: true,
            data,
        });
    } catch (error) {
        console.error('Error al obtener detalle de compra:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al obtener detalle de compra',
            error: error.message,
        });
    }
};

// POST /detalleCompra
export const crear = async (req, res) => {
    try {
        const data = await DetalleCompra.create(req.body);
        res.status(201).json({
            estado: true,
            data,
        });
    } catch (error) {
        console.error('Error al crear detalle de compra:', error);
        res.status(400).json({
            estado: false,
            mensaje: 'Error al crear detalle de compra',
            error: error.message,
        });
    }
};

// PUT /detalleCompra/:id
export const actualizar = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const detalleCompra = await DetalleCompra.findByPk(id);

        if (!detalleCompra) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Detalle de compra no encontrada',
            });
        }

        await detalleCompra.update(req.body);
        res.json({
            estado: true,
            data: detalleCompra,
        });
    } catch (error) {
        console.error('Error al actualizar el detalle de compra:', error);
        res.status(400).json({
            estado: false,
            mensaje: 'Error al actualizar el detalle de compra',
            error: error.message,
        });
    }
};

// DELETE /detalleCompra/:id
export const eliminar = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const detalleCompra = await DetalleCompra.findByPk(id);

        if (!detalleCompra) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Detalle de compra no encontrada',
            });
        }

        await detalleCompra.destroy();
        res.json({
            estado: true,
            mensaje: 'Detalle de compra eliminada correctamente',
        });
    } catch (error) {
        console.error('Error al eliminar el detalle de compra:', error);
        res.status(500).json({
            estado: false,
            mensaje: 'Error al eliminar el detalle de compra',
            error: error.message,
        });
    }
};