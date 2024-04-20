// var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

exports.initializingPassport = (passport)=>{
    passport.use(new LocalStrategy({usernameField:"email",passwordField:"password"}, async function verify(username, password, done) {
        try{
            const user = await User.findOne({username}) //here i pass the email not user so i will change some code here
            if(!user) return  done(null,false);
            if(user.password !== password) return done(null,false,{ message: 'Incorrect username or password.' });
            return done(null,user);
        }catch(error){
            return done(error,false);
        }
    }));
    passport.serializeUser((user,done)=>{
        done(null,user.id);
    })
    passport.deserializeUser(async (id,done)=>{
        try{
            const user = await User.findById(id);
            done(null,user);
        }catch(error){
            done(error,false);
        }   
    })
}


exports.isAuthenticated = (req,res,next)=>{
    if(req.user) return next();
    res.redirect("/login")
}