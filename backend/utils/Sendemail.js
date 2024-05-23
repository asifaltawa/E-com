const nodemailer = require("nodemailer");
require("dotenv").config()
exports.Sendemails = async(email,otp)=>{
    try{
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.EMAIL,
              pass: process.env.EMAIL_PASS,
            },
          });
          const info = await transporter.sendMail({
            from: '"Daily shop 👻" <dailyshop@ethereal.email>', // sender address
            to: email, // list of receivers
            subject: "OTP request ✔", // Subject line
            text: `Your OTP for signup ${otp}`, // plain text body
          });
          console.log("Email send")
    }
    catch(error){
        console.log(error.message)
        throw new Error('Failed to send email');
    }
}