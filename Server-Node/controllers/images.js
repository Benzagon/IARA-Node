import { pool } from '../db.js'
import fetch, { FormData } from 'node-fetch';
import axios from 'axios';
import {readFile, createReadStream} from 'fs'
//Funciones de las rutas. Esto con el objetivo de tener el código lo más organizado posible.
export const uploadImage = async (req, res) => {

    try {

        //Recibir info del front
        const {title, description, id_paciente} = req.body;
        const filename = req.file.filename;
        const path = req.file.path;
        const mimetype = req.file.mimetype

        console.log(path, mimetype)

        const response1 = await fetch('http://127.0.0.1:8000')

        const data1 = await response1.json();
        console.log(data1);

         const form = new FormData();
        const file = createReadStream(path);
        const obj = {
            file: file
        }
        form.append('file', file);
        
        //const file = fileFromSync(path, mimetype)
        //console.log(file)
        const response = await fetch('http://127.0.0.1:8000/predict',{
            method: 'POST',
            files: form,
            body: JSON.stringify(obj),
            headers: {'Content-Type': 'multipart/form-data'},
        })
        
        const prediction = await response.json();

        console.log(prediction)
        
        //Mandar la info a la db
        const [result] = await pool.query("INSERT INTO radiografias (nombre_img, titulo_img, descripcion_img, ruta_img, id_paciente) VALUES (?, ?, ?, ?, ?)", [filename, title, description, path, id_paciente])

        console.log(result)

        //const date = new Date().toString();

        res.json({title, description, path, prediction})

    } catch (error) {
        return res.status(500).json({message: error.message})
    }
    
}

export const getImages = async (req, res) => {

    try {
        const id_paciente = req.body
        const [result] = await pool.query("SELECT * FROM radiografias WHERE id_paciente = ?", [id_paciente])

        console.log(result)

        res.json(result);
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const getImage = async (req, res) => {

    try {
        const id_paciente = req.body
        const [result] = await pool.query("SELECT * FROM radiografias WHERE id = ? AND id_paciente = ?", [req.params.id, id_paciente])

        console.log(result.length)

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

        const [result] = await pool.query("UPDATE radiografias SET titulo_img = ?, descripcion_img = ? WHERE id = ?", [title, description, id])
    
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