import express from "express";
import Productos from "../model/productos.js";
const router = express.Router();

router.get('/api/ratings', async (req, res) => {
    try {
        // Buscar todos los productos y devolver solo los campos necesarios
        const productos = await Productos.find().select({id: 1, title: 1, "rating.rate": 1, "rating.count": 1 });
        res.status(200).json(productos);

    } catch (err) {
        console.error("Error al obtener los ratings de los productos:", err);
        res.status(500).send("Error al obtener los ratings de los productos");
    }
});
  
router.get('/api/ratings/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Buscar el producto por su _id
        const producto = await Productos.findById( id, { id: 1, title: 1, 'rating.rate': 1, 'rating.count': 1 });
        
        if (!producto) {
            return res.status(404).send("Producto no encontrado");
        }
        
        res.status(200).json(producto);

    } catch (err) {
        console.error("Error al obtener el rating del producto:", err);
        res.status(500).send("Error al obtener el rating del producto");
    }
});

router.put('/api/ratings/:id', async (req, res) => {
    const { id } = req.params;
    const { rate } = req.body;

    try {
        // Buscar el producto actual
        const producto = await Productos.findById(id);

        if (!producto) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        // Calcular el nuevo promedio
        const { rating } = producto;
        const nuevoCount = rating.count + 1;
        const nuevoRate = ((rating.rate * rating.count) + rate) / nuevoCount;

        // Actualizar el producto con el nuevo rate y count
        const productoActualizado = await Productos.findByIdAndUpdate(
            id,
            {
                $set: { "rating.rate": nuevoRate },
                $inc: { "rating.count": 1 }
            },
            { new: true }
        );

        res.status(200).json({
            message: "Rating actualizado con éxito",
            producto: productoActualizado
        });
    } catch (err) {
        console.error("Error al actualizar el rating del producto:", err);
        res.status(500).send("Error al actualizar el rating del producto");
    }
});


export default router