
// require third parity modules
const nodemailer = require("nodemailer");

/**
 * @desc    send email using nodemailer
 * @param   {object} options - options related to send email
 * @param   {string} options.FromEmail - email to send mail from
 * @param   {string} options.toEmail - email to send mail to
 * @param   {string} options.subject - email subject
 * @param   {string} options.message - email message
 */
module.exports = async (options) => {
    // 1) Create transporter (service that will send email like "gmail", "mailgun", "mailTrap", "sendGrid")
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        // host: process.env.EMAIL_HOST,
        secure: false,
        //  secure: ture => port: 465
        //  secure: false => port: 587
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // 2) Define email options
    /**
     * @desc    object to assemble mail options
     * @constant
     * @type {{subject: string, from: string, to: string, text: string}}
     */
    const mailOptions = {
        from: options.FromEmail,
        to: options.toEmail,
        subject: options.subject,
        text: options.message
    }

    // 3) Send mail
    await transporter.sendMail(mailOptions);

}