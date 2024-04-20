const User = require("../models/User");

exports.fetchUserById = async(req,res)=>{
    try{
        const id = req.params.id;
        const user = await User.findById(id).exec();
        res.status(200).json(user);
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.updateUser = async(req,res)=>{
    try{
        const id = req.params.id;
        const Updateduser = await User.findByIdAndUpdate(id,req.body,{new:true}).exec();
        res.status(200).json(Updateduser);
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}