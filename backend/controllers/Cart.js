const  Cart  = require('../models/Cart');

exports.addToCart = async (req, res) => {
    const cart = new Cart(req.body);
    try{
        const doc = await cart.save()
        const result = await doc.populate('product')
        return res.status(200).json(result);
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
            data:error.message
        })
    }
}
exports.fetchCartByUserId = async(req,res)=>{
    const {user} = req.query;
    try{
        
        const cartItems = await Cart.find({user:user}).populate('user').populate('product')
        res.status(200).json(cartItems);
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
            data:error.message
        })
    }
}

exports.deleteFromCart = async(req,res)=>{
    try{
        const id = req.params.id;
        const doc = await Cart.findByIdAndDelete(id);
        res.status(200).json(doc);
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
            data:error.message
        })
    }
}

exports.updateCart = async(req,res)=>{
    const { id } = req.params;
   try {
     const cart = await Cart.findByIdAndUpdate(id, req.body, {
       new: true,
     }).populate('product').populate('user')
     res.status(200).json(cart);
   } catch (err) {
     res.status(400).json(err);
   }
}