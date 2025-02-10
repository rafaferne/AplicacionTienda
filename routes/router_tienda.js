
import express from "express";
import Productos from "../model/productos.js";
const router = express.Router();

//Ruta principal
router.get('/', async (req, res) => {
  try {
      // Obtener categorías únicas de los productos
      const categorias = await Productos.distinct('category');
      // Obtener todos los productos
      const productos = await Productos.find();
      // Renderizar la plantilla con los productos y las categorías
      res.render('portada.html', { productos, categorias});

  } catch (err) {
      res.status(500).send('Error al cargar productos y categorías');
  }
});

// Ruta para filtrar productos por categoría
router.get('/categoria/:categoria', async (req, res) => {
  const categoria = req.params.categoria;
  try {
      // Obtener categorías para el menú desplegable
      const categorias = await Productos.distinct('category');
      // Obtener Productos que pertenezcan a la categoría seleccionada
      const productos = await Productos.find({ category: categoria });
      // Renderizar la plantilla con los Productos filtrados y las categorías
      res.render('portada.html', { productos, categorias});
  } catch (err) {
      res.status(500).send('Error al filtrar productos por categoría');
  }
});

// Ruta para buscar productos
router.get('/buscar', async (req, res) => {
  const query = req.query.q; // Obtener la consulta de la barra de búsqueda
  try {
      // Obtener categorías para el menú desplegable
      const categorias = await Productos.distinct('category');
      // Filtrar productos que coincidan con el término de búsqueda en el nombre o descripción
      const productos = await Productos.find({
          $or: [
              { title: { $regex: query, $options: 'i' } },    // Búsqueda insensible a mayúsculas/minúsculas
              { description: { $regex: query, $options: 'i' } },    // Búsqueda insensible a mayúsculas/minúsculas
          ]
      });
      // Renderizar la plantilla con los productos filtrados y las categorías
      res.render('portada.html', { productos, categorias});
  } catch (err) {
      console.error(err);
      res.status(500).send('Error al buscar productos');
  }
});

router.post('/productos/editar/:id', async (req, res) => {
    if (!res.locals.isAdmin) {
      return res.status(403).send("Acceso denegado");
    }
  
    const { id } = req.params;
    const { title, price } = req.body;

    console.log("Datos recibidos:", { id, title, price });  // Debug
  
    try {
      await Productos.findByIdAndUpdate(id, { title, price });
      res.redirect('/');
    } catch (err) {
      res.status(500).send("Error al actualizar el producto");
    }
  });

  /*
router.get('/productos/ratings', async (req, res) => {
  try {
      // Buscar todos los productos y devolver solo los campos necesarios
      const productos = await Productos.find().select({id: 1, title: 1, "rating.rate": 1, "rating.count": 1 });
      res.status(200).json(productos);

  } catch (err) {
      console.error("Error al obtener los ratings de los productos:", err);
      res.status(500).send("Error al obtener los ratings de los productos");
  }
});

router.get('/productos/ratings/:id', async (req, res) => {
  const { id } = req.params;

  try {
      // Buscar el producto por su ID
      const producto = await Productos.findById( id, {id: 1, title: 1, "rating.rate": 1, "rating.count": 1 });

      if (!producto) {
          return res.status(404).send("Producto no encontrado");
      }

      res.status(200).json(producto);
  } catch (err) {
      console.error("Error al obtener el rating del producto:", err);
      res.status(500).send("Error al obtener el rating del producto");
  }
});

router.put('/productos/ratings/:id', async (req, res) => {
  
  const { id } = req.params;
  const { rate, count } = req.body;

  try {
    const productoActualizado = await Productos.findByIdAndUpdate(id,
      { $set: { "rating.rate": rate, "rating.count": count } },
      { new: true }
  );

  res.status(200).json({
    message: "Rating actualizado con éxito",
    producto: productoActualizado
  });

  } catch (err){
    console.error("Error al actualizar el rating del producto:", err);
    res.status(500).send("Error al actualizar el rating del producto");
  }
});
*/

// ... más rutas aquí

export default router