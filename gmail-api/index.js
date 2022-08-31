import nodemailer from 'nodemailer'
import { google } from 'googleapis'

const CLIENT_ID = '606708961766-ttag6051su85n61c05rfcq6nv0kp9p0e.apps.googleusercontent.com'
const CLIENT_SECRET = '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'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//047MDKc5GFQJLCgYIARAAGAQSNwF-L9IrblwO37sKN7ibWOTD3O9i2jMPoJbaJZ-5RZ3DTSl3l1i68g0AHpXjIqrO-bivTRpRHAc'


const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

async function sendMail() {
    try {

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

        const mailOptions = {
            from: 'Luis <luisembonstrizzi@gmail.com>',
            to: '47205114@est.ort.edu.ar',
            subject: "Hola todo bien",
            text: 'Buen dia',
            html: '<h1> Buen dia </h1>'
        }

        const result = await transport.sendMail(mailOptions)

        return result
        
    } catch (error) {
        return error
    }
}

sendMail().then(result => console.log('Email sent...', result)).catch(error => console.log(error.message))