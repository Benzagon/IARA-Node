//Middleware que nos permitirá identificar si existe un Jwt y de esta manera proteger las rutas de nuestra web
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

const authJwt = async (req, res, next) => {
  try {
    console.log(req.cookies);

    const token = req.cookies.AccessToken;

    console.log(token);

    if (token === null)return res.status(401).json({ message: "El token no fue recibido" });

    const decoded = jwt.verify(token, process.env.SECRET);

    req.user = decoded.id;

    const [result] = await pool.query("SELECT * FROM registro WHERE id = ?", [
      req.user,
    ]);

    if (result.length === 0)return res.status(404).json("El token no es válido");

    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default authJwt;
