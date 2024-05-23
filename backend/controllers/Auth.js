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
        const {email,password,confirmpassword} = req.body;
        if(!email || !password){
            return res.status(401).json({
                success:false,
                message:"All field are required"
            })
        }
        const existing = await User.findOne({email});
        if(existing){
            return res.status(401).json({
                success:false,
                message:"User already exist"
            })
        }

        if(password != confirmpassword){
            return res.status(401).json({
                success:false,
                message:"password and confirmed password doesn't matched"
            })
        }
        else{
            const hashedpassword = await bcrypt.hash(password,10);
            const otp = generateOTP();
            const response = await User.create({email:email,password:hashedpassword,otp:otp})
            await Sendemails(email,otp);
            res.status(200).json({
                success:true,
                user:response,
                message:'Otp sended to your mail'
            });
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"internal server error"
        })
    }
}

exports.verifyemail = async(req,res)=>{
    const {email,otp} = req.body;
    const user = await validateUserSignup(email,otp);
    if(user[0] === false){
        return res.status(401).json({message:user[1]});
    }
    return res.status(200).json({
        user
    })
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
            return req.status(400).json({
                success:false,
                message:"User not find. Try to SignUp first"
            })
        }
        if(user.active === false){
            return res.status(401).json({
                success:false,
                message:"Please verify your mail first"
            })
        }
        if(bcrypt.compare(user.password,password)){
            const payload ={
                email:user.email,
                id:user.id,
                role:user.role
            }
            const token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h"
            })
            user.token;
            user.password = undefined
            const options = {
                expiresIn: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true,
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"logged In Successfully"
            })
        }
        else{
            res.status(401).json({ message: 'invalid credentials' })
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Oops! something wrong, Please try again"
        })
    }
    
}