import bcrypt from 'bcryptjs'
import { pool } from '../db.js'
import jwt from 'jsonwebtoken'
import { serialize } from 'cookie'
import nodemailer from 'nodemailer'
import { google } from 'googleapis'
import hbs from 'nodemailer-express-handlebars'
import path from 'path'

const CLIENT_ID = '606708961766-ttag6051su85n61c05rfcq6nv0kp9p0e.apps.googleusercontent.com'
const CLIENT_SECRET = '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'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//04iNrKr181_fHCgYIARAAGAQSNwF-L9Irs5YrqgLaSBzxIXYmeUxQdcN3daD7pXxm7ljENd3uTA8DTqElHINaTREB2NcjOyyyf24'


const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

export const signUp = async (req, res) => {

    try {

        const { firstName, lastName, email, password, doctorId, HospitalName, HospitalEmail } = req.body

        const [existingUser] = await pool.query("SELECT * FROM registro WHERE email = ?", [email])

        if (existingUser.length !== 0) return res.status(404).json({ message: "El usuario ya existe" });

        const [HospitalData] = await pool.query("INSERT INTO hospitales (nombre, email) VALUES (?, ?)", [HospitalName, HospitalEmail])

        const id_hospitales = HospitalData.insertId

        const hashedPassword = await bcrypt.hash(password, 12)

        const [DoctorData] = await pool.query("INSERT INTO registro (nombre, apellido, email, contrasenia, matricula, id_Hospital) VALUES (?, ?, ?, ?, ?, ?)", [firstName, lastName, email, hashedPassword, doctorId, id_hospitales])

        const accessToken = await oAuth2Client.getAccessToken()

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'luisembonstrizzi@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
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
            from: 'Verificación <luisembonstrizzi@gmail.com>',
            to: email,
            subject: 'Verificación',
            template: 'email'
        }

        await transport.sendMail(mailOptions)

        return res.json({ message: "El usuario se ha registrado con éxito" })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const signIn = async (req, res) => {

    try {
        const { email, password } = req.body

        const [existingUser] = await pool.query("SELECT * FROM registro WHERE email = ?", [email])

        console.log(existingUser[0])

        if (existingUser.length === 0) return res.status(404).json({ message: "El usuario no existe" })

        const isPasswordCorrect = await bcrypt.compare(password, existingUser[0].contrasenia)

        console.log(isPasswordCorrect);

        if (!isPasswordCorrect) return res.status(400).json({ message: "La contraseña es inválida" })

        const token = jwt.sign({ id: existingUser[0].id }, process.env.SECRET, { expiresIn: "2m" })

        const refreshToken = jwt.sign({ id: existingUser[0].id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1h" })


        const serializeAccessToken = serialize('AccessToken', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60,
            path: '/'
        })



        const serializeRefreshToken = serialize('RefreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60,
            path: '/'
        })

        res.setHeader('Set-Cookie', [serializeAccessToken, serializeRefreshToken])

        return res.json({ message: "El usuario se ha logueado con éxito" })


    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const refreshToken = async (req, res) => {

    try {

        const refreshToken = req.cookies.RefreshToken;

        console.log(req.cookies.RefreshToken)

        if (!refreshToken) return res.status(401).json("No estas autenticado")

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        console.log(decoded)

        const [existingUser] = await pool.query("SELECT * FROM registro WHERE id = ?", [decoded.id])

        console.log(existingUser)

        if (existingUser.length === 0) return res.status(404).json("El token no es válido")

        console.log(existingUser)

        const token = jwt.sign({ id: existingUser[0].id }, process.env.SECRET, { expiresIn: "2m" })

        const serializeAccessToken = serialize('AccessToken', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60,
            path: '/'
        })

        return res.setHeader('Set-Cookie', serializeAccessToken)

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const logout = async (req, res) => {

    const serializedAccessToken = serialize('AccessToken', null, {
        httpOnly: true,
        maxAge: 0,
        path: '/'
    })


    const serializedRefreshToken = serialize('RefreshToken', null, {
        httpOnly: true,
        maxAge: 0,
        path: '/'
    })

    res.setHeader('Set-Cookie', [serializedAccessToken, serializedRefreshToken])
    return res.status(200).json("Se ha deslogueado correctamente")
}

export const forgotPassword = async (req, res) => {
    res.json("Recuperando contraseña")
}

export const updatePassword = async (req, res) => {
    res.json("Actualizando contraseña")
}

