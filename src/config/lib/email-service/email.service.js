const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    port: 465,               // true for 465, false for other ports
    host: "smtp.gmail.com",
    auth: {
        user: process.env.HOST_EMAIL,
        pass: process.env.HOST_EMAIL_PASSWORD,
    },
    secure: true,
});

async function send (options) {
    try {
        const mailData = {
            from: process.env.HOST_EMAIL,  
            to: options.email,   
            subject: options.subject,
            //text,
            html: options.template,
        };

        transporter.sendMail(mailData, (err, info) => {
            if (err) {
                console.log(err)
                //res.status(200).send({ message: "Mail send", message_id: info.messageID });
                console.log({ message: "Mail send", message_id: info.messageID });
            }
            else
                console.log(info);
        });

    } catch (err) {
        console.log(err);
        //res.status(500).send("Internal server error!");
    }
};

module.exports.send = send;    