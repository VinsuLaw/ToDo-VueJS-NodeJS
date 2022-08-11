import nodemailer from 'nodemailer'

class MailService {
    transporter

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'hotmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        })
    }

    async sendConfirmationMail(to, template) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: template.subject,
            text: template.text,
            html: template.html,
        })
    }
}

export default new MailService()
