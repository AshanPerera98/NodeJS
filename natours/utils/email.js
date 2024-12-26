const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //   1) Creating a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //   2) Mail options
  const mailOptions = {
    from: 'Ashan Perera <ashan.dev@natours.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //   Sending mail
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
