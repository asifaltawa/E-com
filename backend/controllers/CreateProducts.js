const Product = require("../models/Product") 
const mongoose = require('mongoose');

exports.CreateProducts = async(req,res)=>{
    try{
        const products = req.body.products;
        const createdProducts = await Promise.all(
            products.map(async (product) => {
                // Convert string ID to numeric ID
                const numericId = parseInt(product.id);
                // Remove the string id from the product data
                const { id, ...productData } = product;
                return await Product.create({
                    ...productData,
                    numericId
                });
            })
        );
        res.status(201).json(createdProducts);
    }
    catch(err){
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
    const totaldocs = await totalquery.countDocuments().exec();
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
        let product;
        
        // Check if the ID is a valid MongoDB ObjectId
        if (mongoose.Types.ObjectId.isValid(id)) {
            product = await Product.findById(id);
        } else {
            // Try to find by numeric ID
            const numericId = parseInt(id);
            if (!isNaN(numericId)) {
                product = await Product.findOne({ numericId });
                console.log('Looking for product with numericId:', numericId);
            }
        }

        if (!product) {
            console.log('Product not found for ID:', id);
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        console.log('Found product:', product.id, product.title);
        res.status(200).json(product);
    }
    catch(err){
        console.error('Error fetching product:', err);
        res.status(500).json({
            success: false,
            data: "internal server error",
            message: err.message
        });
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

exports.fetchProductsByFilters = async(req,res)=>{
    try{
        // filter = {"category":["smartphone","laptops"]}
        // sort = {_sort:"price",_order="desc"}
        // pagination = {_page:1,_limit=10}
        let condition = {}
        if(!req.query.admin){
            condition.deleted = {$ne:true}
        }
        
        let query = Product.find(condition);
        let totalProductsQuery = Product.find(condition);

        if(req.query.category){
            query = query.find({category: {$in:req.query.category.split(',')}});
            totalProductsQuery = totalProductsQuery.find({category: {$in:req.query.category.split(',')}});
        }
        if(req.query.brand){
            query = query.find({brand: {$in:req.query.brand.split(',')}});
            totalProductsQuery = totalProductsQuery.find({brand: {$in:req.query.brand.split(',')}});
        }
        if(req.query._sort && req.query._order){
            query = query.sort({[req.query._sort]:req.query._order});
        }

        if(req.query._page && req.query._limit){
            const pageSize = req.query._limit;
            const page = req.query._page;
            query = query.skip(pageSize*(page-1)).limit(pageSize);
        }

        const docs = await query.exec();
        const totalItems = await totalProductsQuery.count().exec();

        res.set('X-Total-Count',totalItems);

        res.status(200).json(docs);
    }
    catch(err){
        res.status(400).json(err);
    }
}