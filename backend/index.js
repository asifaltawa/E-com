// create an instence for express 
const express = require("express");
const app = express();
const cors = require("cors")
const { initializingPassport } = require("./utils/passportConfig");
var passport = require('passport');

// load config from env file
require("dotenv").config();
const PORT = process.env.PORT || 4000;
initializingPassport(passport);
// middleware to parsse tbe data
app.use(express.json());
app.use(cors({exposedHeaders:['X-Total-Count']}))
app.use(expressSession({secret:"secret",resave:false,saveUninitialized:false}));
app.use(passport.initialize());
app.use(passport.session());

// // import routes for todo apps
const productRoute = require("./routes/route")
// mount the todo api routes
app.use("/api/v1",productRoute);

// start the server
app.listen(PORT, ()=>{
    console.log(`server start at ${PORT}`)
})

// connect it to the database
const dbConnect = require("./config/database");
const passport = require("passport");

dbConnect();

// default Route
app.get("/",(req,res)=>{
    res.send(`<h1>this is homePage</h1>`)
})