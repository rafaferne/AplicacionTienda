import express from "express";
const router = express.Router();

// Inicializa el carrito si no existe en la sesión
const initCarrito = (req) => {
    if (!req.session.carrito) {
        req.session.carrito = [];
    }
};

// Ruta para agregar un producto al carrito
router.post('/add/:productId', (req, res) => {
    initCarrito(req);

    const productId = req.params.productId;
    const { title, price } = req.body;

    // Busca si el producto ya está en el carrito
    const existingProduct = req.session.carrito.find(item => item.id === productId);

    if (existingProduct) {
        // Si ya existe, incrementa la cantidad
        existingProduct.quantity += 1;
        console.log(productId)
    } else {
        // Si no existe, lo agrega con cantidad 1
        req.session.carrito.push({
            id: productId,
            title,
            price,
            quantity: 1
        });
    }

    res.redirect('/carrito');
});

// Ruta para ver el carrito
router.get('/', (req, res) => {
    const usuario = req.username
    initCarrito(req);
    res.render('carrito', { carritoItems: req.session.carrito, usuario });
});

// Ruta para eliminar un producto del carrito (disminuir cantidad)
router.post('/remove/:productId', (req, res) => {
    initCarrito(req);

    const productId = req.params.productId;
    const productIndex = req.session.carrito.findIndex(item => item.id === productId);

    if (productIndex !== -1) {
        // Disminuir la cantidad si es mayor a 1
        if (req.session.carrito[productIndex].quantity > 1) {
            req.session.carrito[productIndex].quantity -= 1;
        } else {
            // Si la cantidad es 1, elimina el producto del carrito
            req.session.carrito.splice(productIndex, 1);
        }
    }

    res.redirect('/carrito');
});

export default router;