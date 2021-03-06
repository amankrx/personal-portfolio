import nodemailer from "nodemailer"

const emailPass = process.env.EMAIL_PASS

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})
//[1]

export default async (req, res) => {
    const { senderMail, name, content, recipientMail } = req.body
//[2]

    // Check if fields are all filled
    if (senderMail === "" || name === "" || content === "" || recipientMail === "") {
        res.status(403).send("")
        return
    }
//[3]

    const mailerRes = await mailer({ senderMail, name, text: content, recipientMail })
    res.send(mailerRes)
//[4]
}

const mailer = ({ senderMail, name, text, recipientMail }) => {
    const from = name && senderMail ? `${name} <${senderMail}>` : `${name || senderMail}`
    const message = {
        from: senderMail,
        to: `${recipientMail}`,
        subject: `New message from ${name}`,
        html: `<p>You have a new contact form submission in your Portfolio:</p><br>
             <p><strong>Name: </strong> ${name} </p><br>
            <p><strong>Message: </strong> ${text} </p><br>`,
        replyTo: from
    }
//[5]

    return new Promise((resolve, reject) => {
        transporter.sendMail(message, (error, info) =>
            error ? reject(error) : resolve(info)
        )
    })
//[6]
}