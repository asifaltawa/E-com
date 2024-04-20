const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
    title:{
        type:String,
        require:true,
        unique:true,
    },
    description:{
        type:String,
        require:true,
    },
    price:{
        type:Number,
        min:[0,"wrong min price"],
        max:[10000,"wrong max price"],
        require:true,
    },
    discountPercentage:{
        type:Number,
        min:[0,"wrong min discountPercentage"],
        max:[100,"wrong max discountPercentage"],
    },
    rating:{
        type:Number,
        min:[0,"wrong min rating"],
        max:[5,"wrong max rating"],
        
    },
    stock:{
        type:Number,
        min:[0,"wrong min stock"],
        default:0
    },
    brand:{
        type:String,
        require:true,
    },
    category:{
        type:String,
        require:true,
    },
    category:{
        type:String,
        require:true,
    },
    thumbnail:{
        type:String,
        require:true,
    },
    images:{
        type:[String],
        require:true,
    },
    deleted:{
        type:Boolean,
        default:false,
    }
})

// to change the auto created _id to id
const virtual = productSchema.virtual('id');
virtual.get(function(){
    return this._id;
})
productSchema.set('toJSON',{
    virtuals:true,
    versionKey:false,
    transform: function(doc,ret){delete ret._id}
})
module.exports = mongoose.model("Product",productSchema);