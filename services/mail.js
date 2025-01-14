const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendVerificationEmail = async (email, verificationLink) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: 'Email Verification',
    html: `
      <h1>Verify Your Email</h1>
      <p>Click the link below to verify your email:</p>
      <a href="${verificationLink}">Verify Email</a>
    `,
  });
};

module.exports = { sendVerificationEmail };
