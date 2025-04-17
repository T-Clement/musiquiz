const nodemailer = require('nodemailer');

// create and configure SMTP trnsporter
// with env variables
const transporter = nodemailer.createTransport({
  host:     process.env.SMTP_HOST,
  port:     Number(process.env.SMTP_PORT) || 587,
  secure:   process.env.SMTP_SECURE === 'true', // true for port 465, otherwise false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// check SMTP connection on startup
transporter.verify().then(() => {
  console.log('✔️  Email transporter ready');
}).catch(err => {
  console.error('❌  Email transporter error:', err);
});


/**
 * Send an reset password email
 *
 * @param {string} to - mail recipient address
 * @param {string} resetLink - reset password link with token in it
 * @returns {Promise<void>}
 */
async function sendResetPasswordEmail(to, resetLink) {
  // prepare mail content
  const mailOptions = {
    from:    process.env.EMAIL_FROM,          // e.g. '"Musiquiz" <no-reply@musiquiz.com>'
    to: to,                                        // recipient
    subject: 'Réinitialisation de votre mot de passe',
    text: `
    Bonjour,

    Vous avez demandé la réinitialisation de votre mot de passe.

    Cliquez sur le lien suivant (valide 4 heures) pour en définir un nouveau :

    ${resetLink}

    Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email.

    Cordialement,
    L’équipe Musiquiz
        `.trim(),
        html: `
          <p>Bonjour,</p>
          <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
          <p><a href="${resetLink}">Cliquez ici pour réinitialiser votre mot de passe</a> (valide 4 heures)</p>
          <p>Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.</p>
          <br/>
          <p>Cordialement,<br/>L’équipe Musiquiz</p>
    `,
  };

  //send mail wtih prepared content
  await transporter.sendMail(mailOptions);

}

module.exports = { sendResetPasswordEmail };
