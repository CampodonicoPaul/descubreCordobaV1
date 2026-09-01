import {
    DetalleCompra,
    Compra,
} from '../models/index.js';

// GET /detalleCompra
// Usuario autenticado: obtiene los detalles de sus propias compras.
export const obtener = async (req, res) => {
    try {
        const compras = await Compra.findAll({
            where: {
                idUsuario: req.usuario.id,
            },
            attributes: ['id'],
        });

        const idsCompras = compras.map((compra) => compra.id);

        const data = await DetalleCompra.findAll({
            where: {
                idCompra: idsCompras,
            },
        });

        res.json({
            estado: true,
            data,
        });

    } catch (error) {
        console.error('Error al obtener detalles de compra:', error);

        res.status(500).json({
            estado: false,
            mensaje: 'Error al obtener detalles de compra',
            error: error.message,
        });
    }
};

// GET /detalleCompra/:id
// Usuario autenticado: obtiene un detalle perteneciente a una de sus compras.
export const obtenerPorId = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);

        const detalle = await DetalleCompra.findByPk(id);

        if (!detalle) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Detalle de compra no encontrado',
            });
        }

        const compra = await Compra.findOne({
            where: {
                id: detalle.idCompra,
                idUsuario: req.usuario.id,
            },
        });

        if (!compra) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Detalle de compra no encontrado',
            });
        }

        res.json({
            estado: true,
            data: detalle,
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