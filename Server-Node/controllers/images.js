import { pool } from '../db.js'
import fetch from 'node-fetch';
//Funciones de las rutas. Esto con el objetivo de tener el código lo más organizado posible.
export const uploadImage = async (req, res) => {

    try {

        //Recibir info del front
        const {title, description, id_paciente} = req.body;
        const filename = req.file.filename;
        const path = req.file.path;
        
        const response = await fetch('http://127.0.0.1:8000/predict',{
            method: 'post',
            body: JSON.stringify({path}),
            headers: {'Content-Type': 'application/json'}
        })
        
        const {prediction} = await response.json();

        console.log(prediction)
        //Mandar la info a la db
        await pool.query("INSERT INTO radiografias (nombre, titulo, descripcion, ruta, prediccion_cnn, id_Paciente) VALUES (?, ?, ?, ?, ?, ?)", [filename, title, description, path, prediction, id_paciente])

        res.status(200).json({title, description, path, prediction})

    } catch (error) {
        return res.status(500).json({message: error.message})
    }
    
}

export const getImages = async (req, res) => {

    try {
        const id_paciente = req.body
        const [result] = await pool.query("SELECT * FROM radiografias WHERE id_paciente = ?", [id_paciente])

        res.json(result);
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const getImage = async (req, res) => {

    try {
        const id_paciente = req.body
        const [result] = await pool.query("SELECT * FROM radiografias WHERE id = ? AND id_paciente = ?", [req.params.id, id_paciente])

        if(result.length === 0){
            return res.status(404).json({message: "La imagen no fue encontrada"});
        }

        res.json(result[0])
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const updateImage = async (req, res) => {

    try {
        const {id} = req.params

        const {title, description, id_paciente} = req.body;

        const [existingUser] = await pool.query("SELECT * FROM radiografias WHERE id = ? AND id_paciente = ?", [req.params.id, id_paciente])

        if(existingUser.length === 0){
            return res.status(404).json({message: "El usuario no fue encontrado"});
        }

        await pool.query("UPDATE radiografias SET titulo_img = ?, descripcion_img = ? WHERE id = ?", [title, description, id])
    
        return res.json({message: "El paciente ha sido actualizado con éxito"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: error.message})
    }
    
   
}

export const deleteImage = async (req, res) => {

    try {
        const id_paciente = req.body
        const[result] = await pool.query("DELETE FROM radiografias WHERE id_paciente = ? AND id = ?", [id_paciente, req.params.id])

        if(result.affectedRows === 0){
            return res.status(404).json({message: "La imagen no fue encontrada"})
        }

        return res.sendStatus(204).json({message: "La imagen ha sido eliminada correctamente"})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const getImageBySearch = async (req, res) => {
    res.json("Buscando imagen")
}

export const getFrontalImages = (req, res) => {
    res.json("Obteniendo imagenes frontales")
}

export const getProfileImages = (req, res) => {
    res.json("Obteniendo imagenes de perfil")
}

export const sendFile = (req, res) => {
    try {
        const imagePath = req.body.path
        console.log(imagePath)

        res.status(200).sendFile(imagePath)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}