const Brand = require("../models/Brand");

exports.fetchAllbrands = async(req,res)=>{
    try{
        const brands = await Brand.find({});
        res.status(200).json(brands)
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success:false,
            message:err.message
        })
    }
}