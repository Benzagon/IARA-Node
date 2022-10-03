import nodemailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'
import path from 'path'

export const SendVerificationEmail = async (HospitalEmail) => {
    try {
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
            from: 'Verificación <iara.detector@gmail.com>',
            to: HospitalEmail,
            subject: 'Verificación',
            template: 'email'
        }
    
        const sentEmail = await transport.sendMail(mailOptions)
        return sentEmail
    } catch (error) {
        console.log(error)
    }
}

SendVerificationEmail().then(sentEmail => console.log('Email sent...', sentEmail)).catch(error => console.log(error.message))
