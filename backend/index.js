// create an instence for express 
const express = require("express");
const app = express();
const cors = require("cors")
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

// load config from env file
require("dotenv").config();
const PORT = process.env.PORT || 8080;

// middleware to parse the data
app.use(express.json());
app.use(cookieParser());

// CORS configuration
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    exposedHeaders: ['X-Total-Count']
}));

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

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

dbConnect();

// default Route
app.get("/",(req,res)=>{
    res.send(`<h1>this is homePage</h1>`)
})