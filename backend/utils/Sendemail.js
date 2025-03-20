const nodemailer = require("nodemailer");
require("dotenv").config()

exports.Sendemails = async(email, otp, type = 'verification') => {
    try {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.EMAIL,
              pass: process.env.EMAIL_PASS,
            },
        });

        let subject, text, html;

        if (type === 'password_reset') {
            subject = "Password Reset Instructions";
            text = `Your OTP for password reset is: ${otp}. This OTP will expire in 15 minutes.`;
            html = `
                <h2>Reset Your Password</h2>
                <p>We received a request to reset your password.</p>
                <p>Your OTP for password reset is: <strong>${otp}</strong></p>
                <p>This OTP will expire in 15 minutes.</p>
                <p>If you did not request a password reset, please ignore this email.</p>
            `;
        } else {
            // Default verification email
            subject = "OTP for Email Verification";
            text = `Your OTP for email verification is: ${otp}`;
            html = `<p>Your OTP for email verification is: <strong>${otp}</strong></p>`;
        }

        const info = await transporter.sendMail({
            from: `"E-Commerce App" <${process.env.EMAIL}>`,
            to: email,
            subject: subject,
            text: text,
            html: html,
        });

        console.log(`Email sent successfully (${type})`);
    }
    catch(error) {
        console.error("Email error:", error.message);
        throw new Error('Failed to send email');
    }
}