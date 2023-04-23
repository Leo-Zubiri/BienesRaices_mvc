 import nodemailer from 'nodemailer'

 const emailRegister = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const {email,name,token} = datos;

    // Enviar email
    await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Confirma tu cuenta en BienesRaices',
        text: 'Da click en el enlace para confirmar tu cuenta',
        html: `
            <p>Hola ${name}, comprueba tu cuenta en Bienes Raices</p>
            <p>Tu cuenta ya esta lista, solo debes confirmarla en el siguiente enlace:
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirm/${token}">Confirmar cuenta</a></p>

            <p>Si tu no creaste esta cuenta puedes ignorar el mensaje</p>
        `
    })
 }

 export {
    emailRegister
 }