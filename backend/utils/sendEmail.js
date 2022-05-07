const nodemailer = require('nodemailer');

const sendEmail = async function(options){
console.log('nodemailer')
     const transporter = nodemailer.createTransport({
         service : process.env.SMPT_SERVICE,
         host:'smtp.gmail.com',
         port : 587,
         secure:false,
         auth : {
             user : process.env.SMPT_MAIL,
             pass : process.env.SMPT_PASSWORD
         }
     })
     const mailOptions = {
         from : process.env.SMPT_MAIL,
         to : options.email,
         subject : options.subject,
         text : options.message,
    }
        
        console.log('tranporter')
     await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;