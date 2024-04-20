const Category = require("../models/Category");

exports.fetchAllcategories = async(req,res)=>{
    try{
        const categories = await Category.find({});
        res.status(200).json(categories)
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:err.message
        })
    }
}