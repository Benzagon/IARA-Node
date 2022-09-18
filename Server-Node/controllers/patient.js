import { pool } from "../db.js"

export const uploadPatient = async (req, res) => {

    try {
        const {DNI, firstName, lastName} = req.body
        const id_medico = req.user

        const[existingPatient] = await pool.query("SELECT * FROM paciente WHERE dni = ?", [DNI])
        
        if(existingPatient.length !== 0) return res.status(404).json({message: "El paciente ya existe"})

        const [result] = await pool.query("INSERT INTO paciente (DNI, nombre, apellido, id_medico) VALUES (?,?,?,?)", [DNI, firstName, lastName, id_medico])

        return res.json({id: result.insertId, DNI, firstName, lastName })
    } catch (error) {
        return res.status(500).json({ message: error.message})
    }
}

export const getPatients = async (req, res) => {
    
    try {
        const id_medico = req.user

        const [result] = await pool.query("SELECT * FROM paciente WHERE id_medico = ?", [id_medico])

        return res.json(result)
    } catch (error) {
        return res.status(500).json({ message: error.message})
    }
    
}

export const getPatient = async (req, res) => {
    try {
        const id_medico = req.user

        const {id} = req.params

        const [result] = await pool.query("SELECT * FROM paciente WHERE id_medico = ? AND id = ?", [id_medico, id])

        console.log(result.length)

        if(result.length === 0){
            return res.status(404).json({message: "El paciente no fue encontrado"});
        }

        return res.json(result[0])
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const updatePatient = async (req, res) => {

    try {
        const {id} = req.params

        const {DNI, firstName, lastName} = req.body

        const id_medico = req.user

        const [existingPatient] = await pool.query("SELECT * FROM paciente WHERE id_medico = ? AND id = ?", [id_medico, id])

        console.log(existingPatient)

        if(existingPatient.length === 0) return res.status(404).json({message: "El usuario no fue encontrado"});

        await pool.query("UPDATE paciente SET DNI = ?, nombre = ?, apellido = ? WHERE id_medico = ? AND id = ?", [DNI, firstName, lastName, id_medico, id])

        return res.json({message: "El paciente ha sido actualizado con éxito"})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const deletePatient = async (req, res) => {
    try {
        const {id} = req.params

        const id_medico = req.user

        const[result] = await pool.query("DELETE FROM paciente WHERE id_medico = ? AND id = ?", [id_medico, id])

        if(result.affectedRows === 0){
            return res.status(404).json({message: "El usuario no fue encontrado"})
        }

        return res.sendStatus(204).json({message: "El paciente ha sido removido con éxito"})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const getPatientBySearch = async (req, res) => {

    try {
        const { DNI } = req.query;

        const id_medico = req.user
        console.log(id_medico)

        const [result] = await pool.query("SELECT * FROM paciente WHERE id_medico = ? AND DNI LIKE CONCAT ('%', ?, '%')", [id_medico, DNI])

        return res.json(result)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}
    