const User = require("../models/User");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
require("dotenv").config()
// const cookie = require("cookie-parser")
exports.UserSignUp = async(req,res)=>{
    try{
        const response = await User.create(req.body)
        res.status(200).json({
            success:true,
            user:response,
            message:'ENTRY CREATED SUCCESS-FULLY'
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


exports.loginUser = async(req,res)=>{
    // try{
    //     const {email,password} = req.body;
    //     if(!email || !password){
    //         return res.status(401).json({
    //             success:false,
    //             message:"ALL FIELDS ARE REQUIRED"
    //         })
    //     }
    //     let user = await User.findOne({email}).populate()
    //     if(!user){
    //         return req.status(400).json({
    //             success:false,
    //             message:"User not find. Try to SignUp first"
    //         })
    //     }
        
    //     if(password === user.password){
    //         const payload ={
    //             email:user.email,
    //             id:user.id,
    //             role:user.role
    //         }
    //         const token = jwt.sign(payload,process.env.JWT_SECRET,{
    //             expiresIn:"2h"
    //         })
    //         user.token;
    //         user.password = undefined
    //         const options = {
    //             expiresIn: new Date(Date.now() + 3*24*60*60*1000),
    //             httpOnly:true,
    //         }
    //         res.cookie("token",token,options).status(200).json({
    //             success:true,
    //             token,
    //             user,
    //             message:"logged In Successfully"
    //         })
    //     }
    //     else{
    //         res.status(401).json({ message: 'invalid credentials' })
    //     }
    // }
    // catch(error){
    //     console.log(error);
    //     return res.status(500).json({
    //         success:false,
    //         message:"Oops! something wrong, Please try again"
    //     })
    // }
    
}