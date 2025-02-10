import express from "express";
import jwt from "jsonwebtoken"; 
import Usuarios from "../model/usuarios.js"; 
const router = express.Router();

router.get('/login', (req, res) => {
  res.render("login.html");
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const usuario = await Usuarios.findOne({ username: username, password: password });

  if (usuario) {
    req.session.usuario = usuario;

    // comprobar el campo admin
    const token = jwt.sign({ usuario: usuario.username, admin: usuario.admin }, process.env.SECRET_KEY);

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.IN === 'production' 
    }).redirect('/');
  }
});


router.get("/logout", (req, res) => {
  req.session.destroy(); 
  res.clearCookie("access_token"); 
  res.redirect("/");
});

export default router