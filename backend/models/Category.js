const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema({
    label:{type:String ,require:true, unique:true },
    value:{type:String,require:true,unique:true},
})

// to change the auto created _id to id
const virtual = categorySchema.virtual('id');
virtual.get(function(){
    return this._id;
})
categorySchema.set('toJSON',{
    virtuals:true,
    versionKey:false,
    transform: function(doc,ret){delete ret._id}
})
module.exports = mongoose.model("Category",categorySchema);