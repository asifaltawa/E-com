const Product = require("../models/Product") 

exports.CreateProducts = async(req,res)=>{
    try{
        
        // create new todo obj and insert it into database
        const response = await Product.create(req.body);
        // send a json response with a success flag
        res.status(200).json(response)
    }
    catch(err){
        console.error(err)
        console.log(err)
        res.status(500).json(
            {
                success:false,
                data:"internal server error",
                message:err.message
            }
        )
    }
}

exports.fetchAllProducts = async(req,res)=>{
    let condition = {}
    if(!req.query.admin){
        condition.deleted = {$ne:true}
    }
    let query = Product.find(condition);
    let totalquery = Product.find(condition)
    if(req.query.category){
        query = query.find({category:req.query.category})
        totalquery = totalquery.find({category:req.query.category})
    }
    if(req.query.brand){
        query = query.find({brand:req.query.brand})
        totalquery = totalquery.find({brand:req.query.brand})
    }
    if(req.query._sort && req.query._order){
        query = query.sort({[req.query._sort]:req.query._order})
    }
    const totaldocs = await totalquery.count().exec();
    console.log(totaldocs)

    if(req.query._page && req.query._limit){
        const pageSize = req.query._limit;
        const page = req.query._page;
        query =  query.skip(pageSize * (page - 1)).limit(pageSize)
    }
    try{
        const doc = await query.exec();
        res.set('X-Total-Count',totaldocs)
        res.status(200).json(doc)
    }catch(err){
        console.error(err)
        console.log(err)
        res.status(500).json(
            {
                success:false,
                data:"internal server error",
                message:err.message
            }
        )
    }
}

exports.fetchProductsById = async(req,res)=>{
    try{
        const id = req.params.id;
        const product = await Product.findById(id);
        res.status(200).json(product);
    }
    catch(err){
        console.error(err)
        console.log(err)
        res.status(500).json(
            {
                success:false,
                data:"internal server error",
                message:err.message
            }
        )
    }
}

exports.updateProducts = async(req,res)=>{
    try{
        const id = req.params.id;
        const updatedProducts = await Product.findByIdAndUpdate(id,req.body,{new:true});
        res.status(200).json(updatedProducts)
    }
    catch(err){
        console.error(err)
        console.log(err)
        res.status(500).json(
            {
                success:false,
                data:"internal server error",
                message:err.message
            }
        )
    }
}