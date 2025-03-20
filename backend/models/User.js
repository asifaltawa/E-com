const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email:{type:String,required:true},
    password:{type:String,required:true},
    addresses:{type:[mongoose.Schema.Types.Mixed]},
    role:{type:String,required:true,default:"user"},
    name:{type:String},
    order:{type:[mongoose.Schema.Types.Mixed]},
    active:{type:Boolean,default:false},
    otp:{type: String,required: true},
    resetPasswordOtp: {type: String},
    resetPasswordExpires: {type: Date},
    expireAt: {
        type: Date,
        default: Date.now,
        index: {
          expireAfterSeconds: 60,
          partialFilterExpression: { active: false }
        }
      }
})

const virtual = userSchema.virtual('id');
virtual.get(function(){
    return this._id;
})
userSchema.set('toJSON',{
    virtuals:true,
    versionKey:false,
    transform: function(doc,ret){delete ret._id}
})

module.exports = mongoose.model("User",userSchema)