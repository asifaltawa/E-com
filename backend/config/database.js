const mongoose = require("mongoose");

require("dotenv").config();
const dbConnect = ()=>{
    mongoose.connect(process.env.DATABASE_URL,{
        // useNewUrlParser:true,
        // useUnifiedTopology:true
    })
    .then(()=>{console.log("db ka connnection succesfull")})
    .catch((error)=>{
        console.log("not connected")
        console.log(error.message)
        process.exit(1);
    });
}
module.exports = dbConnect;
