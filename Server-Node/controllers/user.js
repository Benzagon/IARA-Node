import bcrypt from 'bcryptjs'
import { pool } from '../db.js'
import jwt from 'jsonwebtoken'
import { serialize } from 'cookie'
import nodemailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'
import path from 'path'
import fetch from 'node-fetch';
import { SendVerificationEmail } from '../libs/send.Email.js'


export const signUp = async (req, res) => {

    try {

        const { firstName, lastName, email, password, doctorId, HospitalEmail } = req.body

        const [existingUser] = await pool.query("SELECT * FROM registro WHERE email = ?", [email])

        const [existingHospital] = await pool.query("SELECT * FROM hospitales WHERE email = ?", [HospitalEmail])

        if(existingUser.length !== 0 && existingHospital.length !== 0) return res.status(409).json({ message: "El usuario ya existe" });

        let hashedPassword;

        let id_hospitales;

        if(existingHospital.length !== 0 && existingUser.length === 0){
                    
            hashedPassword = await bcrypt.hash(password, 12)
            
            id_hospitales = existingHospital[0].id

            SendVerificationEmail(HospitalEmail)

            SendVerificationEmail().then(sentEmail => console.log('Email sent...', sentEmail)).catch(error => console.log(error.message))

            
            //Es poco usual pero es que sino me la complico más 
            //const response = await fetch('ruta del front')

            //const {roles} = await response.json();

            const roles = "Usuario_Verificado"

            await pool.query("INSERT INTO registro (nombre, apellido, email, contrasenia, matricula, roles , id_Hospital) VALUES (?, ?, ?, ?, ?, ?, ?)", [firstName, lastName, email, hashedPassword, doctorId, roles, id_hospitales])

            //await pool.query("INSERT INTO registro (nombre, apellido, email, contrasenia, matricula, id_Hospital) VALUES (?, ?, ?, ?, ?, ?)", [firstName, lastName, email, hashedPassword, doctorId, id_hospitales])
            
            return res.json({ message: "Nos estamos contactando con el hospital el cual corresponde el usuario con el objetivo de verificar su integridad" })
        }

        hashedPassword = await bcrypt.hash(password, 12)

        await pool.query("INSERT INTO hospitales (email) VALUES (?)", [HospitalEmail])

        const [HospitalInserted] = await pool.query("SELECT * FROM hospitales WHERE email = ?", [HospitalEmail])

        id_hospitales = HospitalInserted[0].id

        SendVerificationEmail(HospitalEmail)
        
        //Es poco usual pero es que sino me la complico más 
        //const response = await fetch('ruta del front')

        //const {roles} = await response.json();

        //await pool.query("INSERT INTO registro (nombre, apellido, email, contrasenia, matricula, roles , id_Hospital) VALUES (?, ?, ?, ?, ?, ?, ?)", [firstName, lastName, email, hashedPassword, doctorId, roles, id_hospitales])

        await pool.query("INSERT INTO registro (nombre, apellido, email, contrasenia, matricula, id_Hospital) VALUES (?, ?, ?, ?, ?, ?)", [firstName, lastName, email, hashedPassword, doctorId, id_hospitales])
        
        res.json({ message: "Nos estamos contactando con el hospital el cual corresponde el usuario con el objetivo de verificar su integridad" })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }

}

export const signIn = async (req, res) => {

    try {
        const { email, password } = req.body

        console.log(req.body)

        const [existingUser] = await pool.query("SELECT * FROM registro WHERE email = ?", [email])

        if (existingUser.length === 0) return res.status(404).json({ message: "El usuario no existe" })

        const isPasswordCorrect = await bcrypt.compare(password, existingUser[0].contrasenia)

        if (!isPasswordCorrect) return res.status(400).json({ message: "La contraseña es inválida" })

        const token = jwt.sign({ id: existingUser[0].id }, process.env.SECRET, { expiresIn: "2m" })

        const refreshToken = jwt.sign({ id: existingUser[0].id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1h" })

        console.log(token)

        console.log(refreshToken)

        const serializeAccessToken = serialize('AccessToken', token, {
            httpOnly: true,
            expiresIn: 0,
            path: '/'
        })



        const serializeRefreshToken = serialize('RefreshToken', refreshToken, {
            httpOnly: true,
            expiresIn: 0,
            path: '/'
        })

        return res.setHeader('Set-Cookie', [serializeAccessToken, serializeRefreshToken]).json({ message: "El usuario se ha logueado con éxito" })


    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const refreshToken = async (req, res) => {

    try {

        const refreshToken = req.cookies.RefreshToken;

        if (!refreshToken) return res.status(401).json("El usuario no está autenticado")

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        const [existingUser] = await pool.query("SELECT * FROM registro WHERE id = ?", [decoded.id])

        if (existingUser.length === 0) return res.status(403).json("El token no es válido")

        const token = jwt.sign({ id: existingUser[0].id }, process.env.SECRET, { expiresIn: "2m" })

        const serializeAccessToken = serialize('AccessToken', token, {
            httpOnly: true,
            expiresIn: 0,
            path: '/'
        })

        res.setHeader('Set-Cookie', serializeAccessToken).json({ message: "El nuevo access token ha sido creado correctamente" })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const logout = async (req, res) => {

    try {
        const serializedAccessToken = serialize('AccessToken', null, {
            maxAge: 0,
            path: '/'
        })
    
    
        const serializedRefreshToken = serialize('RefreshToken', null, {
            maxAge: 0,
            path: '/'
        })
    
        res.setHeader('Set-Cookie', [serializedAccessToken, serializedRefreshToken]).json({message: "Se ha deslogueado correctamente"})
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const forgotPassword = async (req, res) => {

    try {
        const { email } = req.body

        const [existingEmail] = await pool.query("SELECT * FROM registro WHERE email = ?", [email])
        

        if (existingEmail.length === 0) return res.status(404).json({ message: "El email no existe" });

        const transport = nodemailer.createTransport({
            host: 'smtp-relay.sendinblue.com',
            port: 587,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.SMTP_PASSWORD
            }
        })

        const handlebarsOptions = {
            viewEngine: {
                extname: ".handlebars",
                partialsDir: path.resolve('./views'),
                defaultLayout: false
            },
            viewPath: path.resolve('./views'),
            extName: ".handlebars"
        }

        transport.use('compile', hbs(handlebarsOptions))

        const mailOptions = {
            from: 'Recuperación de contraseña <iara.detector@gmail.com>',
            to: email,
            subject: 'Recuperación de contraseña',
            template: 'ForgotPassword'
        }

        await transport.sendMail(mailOptions)

        res.json({
            id: existingEmail[0].id,
            message: "Ya hemos enviado un mail al email ingresado"
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const updatePassword = async (req, res) => {
    try {
        const {password, id} = req.body

        const hashedPassword = await bcrypt.hash(password, 12)

        await pool.query("UPDATE registro SET contrasenia = ? WHERE id = ?", [hashedPassword, id])

        res.json({message: "La contraseña ha sido actualizada con éxito"})
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

