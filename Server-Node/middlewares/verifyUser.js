import { pool } from "../db.js";

export const verifyUser = async (req, res, next) => {
    //Verificar si el usuario tiene el rol de "Usuario verificado"
    try {
        const {rol, id_usuario} = req.body;

        console.log(id_usuario)

        console.log(rol);

        if (!rol) return res.status(401).json({ message: "El rol no fue recibido" });

        const [existingUser] = await pool.query("SELECT * FROM registro WHERE id = ? AND roles = ?", [id_usuario, rol]);

        if(existingUser.length === 0) return res.status(404).json({message: "El rol no es válido"});
        
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}