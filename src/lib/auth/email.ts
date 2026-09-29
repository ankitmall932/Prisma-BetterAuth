import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport( {
    host: process.env.BREVO_SMTP_HOST!,
    port: Number( process.env.BREVO_SMTP_PORT! ),
    secure: false,
    auth: {
        user: process.env.BREVO_SMTP_USERNAME!,
        pass: process.env.BREVO_SMTP_PASSWORD!,
    }
} );

export async function sendEmail ( {
    to,
    subject,
    text
}: {
    to: string;
    subject: string;
    text: string;
} )
{
    await transporter.sendMail( {
        from: process.env.BREVO_MAIL_FROM!,
        to,
        subject,
        text,
    } );
}