const Order = require("../models/Order");

exports.createOrder = async(req,res)=>{
    const order = new Order(req.body);
    try{
        const doc = await order.save()
        const result = await doc.populate('user')
        res.status(200).json(result);
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
            data:error.message
        })
    }
}

exports.fetchAllOrders = async(req,res)=>{
    try{
        // Get user ID from params or use authenticated user's ID
        const userId = req.params.id || req.user?.id;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
                data: "Please provide a valid user ID"
            });
        }

        const orders = await Order.find({user: userId}).populate('user');
        res.status(200).json(orders);
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            data: error.message
        });
    }
}

exports.fetchAllOrdersAdmins = async(req,res)=>{
    let query = Order.find({deleted:{$ne:true}});
    let totalquery = Order.find({})
    
    
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

exports.updateOrder = async(req,res)=>{
    try{
        const id = req.params.id;
        const order = await Order.findByIdAndUpdate(id,req.body,{new:true})
        res.status(200).json(order);
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
            data:error.message
        })
    }
}