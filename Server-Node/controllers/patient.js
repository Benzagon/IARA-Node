import { pool } from "../db.js";
import { timeConverter } from "../libs/time.Converter.js";

export const uploadPatient = async (req, res) => {

    try {
        const {DNI} = req.body;
        const id_medico = req.user;

        const[existingPatient] = await pool.query("SELECT * FROM paciente WHERE dni = ? AND id_medico", [DNI, id_medico]);
        
        if(existingPatient.length !== 0) return res.status(409).json({message: "El paciente ya existe"});

        const [result] = await pool.query("INSERT INTO paciente (DNI, id_medico) VALUES (?,?)", [DNI, id_medico]);

        res.json({id: result.insertId, DNI});
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
}

export const getPatients = async (req, res) => {
    
    try {
        const id_medico = req.user;

        const [result] = await pool.query("SELECT id, DNI FROM paciente WHERE id_medico = ?", [id_medico]);

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
    
}

export const getPatient = async (req, res) => {
    try {
        const id_medico = req.user;

        const {id} = req.params;

        const [result] = await pool.query("SELECT id, DNI FROM paciente WHERE id_medico = ? AND id = ?", [id_medico, id]);

        console.log(result.length);

        if(result.length === 0){
            return res.status(404).json({message: "El paciente no fue encontrado"});
        };

        res.json(result[0]);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const updatePatient = async (req, res) => {

    try {
        const {id} = req.params

        const {DNI} = req.body

        const id_medico = req.user

        const [existingPatient] = await pool.query("SELECT * FROM paciente WHERE id_medico = ? AND id = ?", [id_medico, id])

        console.log(existingPatient)

        if(existingPatient.length === 0) return res.status(404).json({message: "El usuario no fue encontrado"});

        await pool.query("UPDATE paciente SET DNI = ? WHERE id_medico = ? AND id = ?", [DNI, id_medico, id])

        res.status(201).json({message: "El paciente ha sido actualizado con éxito"})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const deletePatient = async (req, res) => {
    try {
        const {id} = req.params

        const id_medico = req.user

        const[result] = await pool.query("DELETE FROM paciente WHERE id_medico = ? AND id = ?", [id_medico, id])

        if(result.affectedRows === 0){
            return res.status(404).json({message: "El paciente no fue encontrado"})
        }

        res.sendStatus(204)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const getPatientBySearch = async (req, res) => {

    try {
        const { DNI } = req.query;

        const id_medico = req.user
        console.log(id_medico)

        const [result] = await pool.query("SELECT id, dni FROM paciente WHERE id_medico = ? AND DNI LIKE CONCAT ('%', ?, '%')", [id_medico, DNI])

        res.json(result)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const getPatientUploadedRecently = async (req, res) => {

    try {
        const id_medico = req.user

        console.log(id_medico)

        const [pacientesRecientes] = await pool.query("SELECT id, dni, createdAt FROM paciente WHERE id_medico = ? ORDER BY createdAt DESC", [id_medico])

        pacientesRecientes.map((paciente) => paciente.createdAt = timeConverter(paciente.createdAt))

        res.json(pacientesRecientes)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})
    }
}