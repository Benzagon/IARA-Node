import { pool } from '../db.js'
import fetch from 'node-fetch';
//Funciones de las rutas. Esto con el objetivo de tener el código lo más organizado posible.
export const uploadImage = async (req, res) => {

    try {

        //Recibir info del front
        const {id_paciente} = req.params;
        const filename = req.file.filename;
        const path = req.file.path;
        
        const response = await fetch('http://127.0.0.1:8000/predict',{
            method: 'post',
            body: JSON.stringify({path}),
            headers: {'Content-Type': 'application/json'}
        })
        
        const {prediction_cnn, prediction_transformers, prediction_average} = await response.json();

        console.log(prediction_cnn)
        console.log(prediction_transformers)
        console.log(prediction_average)
        //Mandar la info a la db
        await pool.query("INSERT INTO radiografias (nombre, ruta, prediccion_cnn, prediccion_transformers, prediccion_promedio, id_Paciente) VALUES (?, ?, ?, ?, ?, ?)", [filename, path, prediction_cnn, prediction_transformers, prediction_average, id_paciente])

        res.status(200).json({path, prediction_cnn, prediction_transformers, prediction_average})

    } catch (error) {
        res.status(500).json({message: error.message})
    }
    
}

export const getImages = async (req, res) => {

    try {
        console.log(req.params)
        const id_paciente = req.params.id

        const [result] = await pool.query("SELECT ruta, prediccion_cnn, prediccion_transformers, prediccion_promedio FROM radiografias WHERE id_paciente = ?", [id_paciente])

        res.json(result);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const getImage = async (req, res) => {

    try {
        const {id, id_paciente} = req.params
        const [result] = await pool.query("SELECT ruta, prediccion_cnn, prediccion_transformers, prediccion_promedio FROM radiografias WHERE id = ? AND id_paciente = ?", [id, id_paciente])

        if(result.length === 0){
            return res.status(404).json({message: "La imagen no fue encontrada"});
        }

        res.json(result[0])
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}


export const deleteImage = async (req, res) => {

    try {
        const {id, id_paciente} = req.params
        const[result] = await pool.query("DELETE FROM radiografias WHERE id = ? AND id_paciente = ?", [id, id_paciente])

        if(result.affectedRows === 0){
            return res.status(404).json({message: "La imagen no fue encontrada"})
        }

        res.sendStatus(204).json({message: "La imagen ha sido eliminada correctamente"})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}
export const sendFile = (req, res) => {
    try {
        const imagePath = req.body.path
        console.log(imagePath)

        res.status(200).sendFile(imagePath)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}