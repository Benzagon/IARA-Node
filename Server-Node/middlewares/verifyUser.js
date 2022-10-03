import { pool } from "../db.js";

export const verifyUser = async (req, res, next) => {
    //Verificar si el usuario tiene el rol de "Usuario verificado"
    try {
        const rol = req.headers['rol'];

        const id_usuario = req.headers['id_usuario'];

        console.log(rol);

        if (rol === null) return res.status(401).json({ message: "El rol no fue recibido" });

        const [existingUser] = await pool.query("SELECT * FROM registro WHERE id = ?", [id_usuario]);

        if(existingUser.length === 0) return res.status(404).json("El rol no es válido");
        
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}