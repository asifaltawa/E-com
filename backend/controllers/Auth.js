const User = require("../models/User");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const { Sendemails } = require("../utils/Sendemail");

require("dotenv").config()
// const cookie = require("cookie-parser")
const generateOTP =()=>{
    let digit = '0123456789';
    let OTP = "";
    let len = digit.length
    for(let i=0;i<4;i++){
        OTP += digit[Math.floor(Math.random()*len)]   // Returns a random integer from 0 to 10:
                                                      // Math.floor(Math.random() * 11);
    }
    return OTP;
}
exports.UserSignUp = async(req,res)=>{
    try{
        console.log('Signup request body:', req.body);
        const {email, password, confirmpassword, role} = req.body;
        if(!email || !password){
            console.log('Missing required fields:', { email, password });
            return res.status(400).json({
                success:false,
                message:"Email and password are required"
            })
        }
        const existing = await User.findOne({email});
        if(existing){
            console.log('User already exists:', email);
            return res.status(400).json({
                success:false,
                message:"User already exists"
            })
        }

        if(password !== confirmpassword){
            console.log('Passwords do not match');
            return res.status(400).json({
                success:false,
                message:"Password and confirmed password don't match"
            })
        }
        
        const hashedpassword = await bcrypt.hash(password,10);
        const otp = generateOTP();
        const response = await User.create({
            email: email,
            password: hashedpassword,
            otp: otp,
            role: role || 'user',
            active: false,
            addresses: [],
            order: []
        });
        await Sendemails(email,otp);
        res.status(201).json({
            success:true,
            user:response,
            message:'OTP sent to your email'
        });
    } catch(error){
        console.error('Signup error:', error);
        res.status(500).json({
            success:false,
            message:"Internal server error",
            error:error.message
        });
    }
}

exports.verifyemail = async(req,res)=>{
    const {email,otp} = req.body;
    const user = await validateUserSignup(email,otp);
    if(user[0] === false){
        return res.status(401).json({
            success: false,
            message: user[1]
        });
    }
    return res.status(200).json({
        success: true,
        user: user[1]
    });
}

exports.resendOTP = async(req, res) => {
    try {
        const { email } = req.body;
        
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found. Please sign up first."
            });
        }
        
        // Generate a new OTP
        const newOTP = generateOTP();
        
        // Update the user's OTP in the database
        await User.findByIdAndUpdate(user._id, {
            $set: { otp: newOTP }
        });
        
        // Send the new OTP via email
        await Sendemails(email, newOTP);
        
        return res.status(200).json({
            success: true,
            message: "A new OTP has been sent to your email"
        });
    } catch (error) {
        console.error("Resend OTP error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to resend OTP. Please try again."
        });
    }
}

const validateUserSignup = async(email,otp)=>{
    const user = await User.findOne({email})
    if(!user){
        return [false,'User not found']
    }
    if(user && user.otp != otp){
        return [false,'Invalid Otp']
    }
    const updatedUser = await User.findByIdAndUpdate(user._id, {
        $set: { active: true },
    });
    return [true, updatedUser];
}


exports.loginUser = async(req,res)=>{
    try{
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(401).json({
                success:false,
                message:"ALL FIELDS ARE REQUIRED"
            })
        }
        let user = await User.findOne({email}).populate()
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found. Try to SignUp first"
            })
        }
        if(user.active === false){
            return res.status(401).json({
                success:false,
                message:"Please verify your email first"
            })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(isPasswordValid){
            const payload ={
                email:user.email,
                id:user.id,
                role:user.role
            }
            const token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h"
            })
            user.token = token;
            user.password = undefined;
            const options = {
                expiresIn: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true,
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"Logged in successfully"
            })
        }
        else{
            res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' 
            })
        }
    }
    catch(error){
        console.error("Login error:", error);
        return res.status(500).json({
            success:false,
            message:"Oops! something went wrong, Please try again"
        })
    }
}

exports.forgotPassword = async (req, res) => {
  try {
    console.log('Forgot password request received:', req.body);
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please check your email address."
      });
    }

    // Generate a reset token (you could use a random string or OTP)
    const resetOtp = generateOTP();
    
    // Save the reset token to the user's document with an expiry time
    await User.findByIdAndUpdate(user._id, {
      $set: { 
        resetPasswordOtp: resetOtp,
        resetPasswordExpires: Date.now() + 15 * 60 * 1000 // 15 minutes
      }
    });
    
    // Send the reset token to the user's email
    await Sendemails(email, resetOtp, 'password_reset');
    
    return res.status(200).json({
      success: true,
      message: "Password reset instructions have been sent to your email"
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to process your request. Please try again later."
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    
    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP and new password are required"
      });
    }
    
    // Find the user by email and valid reset token
    const user = await User.findOne({ 
      email,
      resetPasswordOtp: otp,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token"
      });
    }
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update the user's password and clear the reset token fields
    await User.findByIdAndUpdate(user._id, {
      $set: { password: hashedPassword },
      $unset: { resetPasswordOtp: "", resetPasswordExpires: "" }
    });
    
    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully"
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to reset password. Please try again later."
    });
  }
};