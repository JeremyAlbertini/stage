const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'hebesoft.test@gmail.com',
        pass: 'hbty usve fmbx djko'
    }
});

async function sendNotificationEmail(to, subject, message) {
    await transporter.sendMail({
        from: '"Hébésoft" <hebesoft.test@gmail.com>',
        to: to,
        subject: subject,
        text: message
    });
}

module.exports = { sendNotificationEmail };