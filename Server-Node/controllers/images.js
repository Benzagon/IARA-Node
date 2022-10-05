import { pool } from '../db.js'
import fetch from 'node-fetch';
import fs from 'fs-extra'
//Funciones de las rutas. Esto con el objetivo de tener el código lo más organizado posible.
export const uploadImage = async (req, res) => {

    try {

        console.log(req.file)
        const {id_paciente} = req.params;
        const filename = req.file.filename;
        const path = req.file.path;


        if(req.file.mimetype === 'image/jpeg'){
            const response = await fetch('http://127.0.0.1:8000/predict_jpg',{
            method: 'post',
            body: JSON.stringify({path}),
            headers: {'Content-Type': 'application/json'}
            })

            const {prediction_cnn, prediction_transformers, prediction_average} = await response.json();

            console.log(prediction_cnn)
            console.log(prediction_transformers)
            console.log(prediction_average)

            await pool.query("INSERT INTO radiografias (nombre, ruta, prediccion_cnn, prediccion_transformers, prediccion_promedio, id_Paciente) VALUES (?, ?, ?, ?, ?, ?)", [filename, path, prediction_cnn, prediction_transformers, prediction_average, id_paciente])

            return res.status(201).json({path, prediction_cnn, prediction_transformers, prediction_average})
        }

        const response = await fetch('http://127.0.0.1:8000/predict_dicom',{
            method: 'post',
            body: JSON.stringify({path}),
            headers: {'Content-Type': 'application/json'}
        })

        await fs.remove(path)

        const {prediction_cnn, prediction_transformers, prediction_average, new_path} = await response.json();

        console.log(prediction_cnn)
        console.log(prediction_transformers)
        console.log(prediction_average)
        console.log(new_path)

        await pool.query("INSERT INTO radiografias (nombre, ruta, prediccion_cnn, prediccion_transformers, prediccion_promedio, id_Paciente) VALUES (?, ?, ?, ?, ?, ?)", [filename, new_path, prediction_cnn, prediction_transformers, prediction_average, id_paciente])

        res.status(201).json({new_path, prediction_cnn, prediction_transformers, prediction_average})

    } catch (error) {
        res.status(500).json({message: error.message})
    }
    
}

export const saveImageRoute = async (req, res) => {
    try {
        const imagePath = req.file.path
        console.log('Esta es la imagen convertida', imagePath)
    
        res.json({path: imagePath})
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
        console.log(req.params)
        const {id_paciente, id} = req.params
        const [result] = await pool.query("SELECT ruta, prediccion_cnn, prediccion_transformers, prediccion_promedio FROM radiografias WHERE id_Paciente = ? AND id = ?", [id_paciente, id])

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
        const {id_paciente, id} = req.params

        const [existingImage] = await pool.query("SELECT ruta FROM radiografias WHERE id_Paciente = ? AND id = ?", [id_paciente, id])

        console.log(existingImage[0].ruta)

        await fs.remove(existingImage[0].ruta.toString())

        const[deletedImage] = await pool.query("DELETE FROM radiografias WHERE id_paciente = ? AND id = ?", [id_paciente, id])

        if(deletedImage.affectedRows === 0){
            return res.status(404).json({message: "La imagen no fue encontrada"})
        }

        res.sendStatus(204)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}
export const sendFile = async(req, res) => {
    try {
        const imagePath = req.body.path
        console.log(imagePath)

        res.sendFile(imagePath)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

