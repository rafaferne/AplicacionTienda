import express from "express";
import nunjucks from "nunjucks";
import connectDB from './model/db.js';
import session from "express-session";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

// Las demas rutas con código en el directorio routes
import TiendaRouter from "./routes/router_tienda.js"
import CarritoRouter from "./routes/router_carrito.js"
import UsuariosRouter from "./routes/router_usuarios.js"
import ApiRouter from "./routes/router_api.js"


connectDB();

const app = express();

app.use(express.json())

const IN = `development`

app.use(cookieParser())

const autentificación = (req, res, next) => {
	const token = req.cookies.access_token;
	if (token) {
	  try {
		const data = jwt.verify(token, process.env.SECRET_KEY);
		req.username = data.usuario;  // Establece el nombre de usuario en req
		res.locals.isAuthenticated = true;
		res.locals.username = req.username;
		res.locals.isAdmin = data.admin === true;
	  } catch (err) {
		res.locals.isAuthenticated = false;
		res.locals.username = null;
		res.locals.isAdmin = false;
	  }
	} else {
	  res.locals.isAuthenticated = false;
	  res.locals.username = null;
	  res.locals.isAdmin = false;
	}
	next();
  };
  
app.use(autentificación)

nunjucks.configure('views', {         // directorio 'views' para las plantillas html
	autoescape: true,
	noCache:    IN == 'development',   // true para desarrollo, sin cache
	watch:      IN == 'development',   // reinicio con Ctrl-S
	express: app
})
app.set('view engine', 'html')

app.use(express.static('public'))     // directorio public para archivos

app.use(express.urlencoded({ extended: true })); //Para tener limpios los datos

app.use(session({
	secret: 'DAIapp',      // a secret string used to sign the session ID cookie
	resave: false,            // don't save session if unmodified
	saveUninitialized: false  // don't create session until something stored
}))

// test para el servidor
app.get("/hola", (req, res) => {
    res.send(`Autenticado: ${res.locals.isAuthenticated}, Usuario: ${res.locals.username}`);
});

app.use("/", TiendaRouter);
app.use("/carrito", CarritoRouter);
app.use("/", UsuariosRouter);
app.use("/", ApiRouter);


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutandose en  http://localhost:${PORT}`);
})