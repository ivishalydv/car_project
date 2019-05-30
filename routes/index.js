var express=require("express");
var router=express.Router();
var Car=require("../models/carSchema");
var Comments=require("../models/comments");
var passport=require("passport");
var User=require("../models/user");

//Basic Route
router.get("/",(req,res)=>{
    res.redirect("/cars");
});

//AUTH ROUTES

router.get("/register",(req,res)=>{
    res.render("register");
});


//Handle sign up logic

router.post("/register",(req,res)=>{
    var newUser=new User({username:req.body.username});
    User.register(newUser,req.body.password,(err,user)=>{
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,()=>{
            res.redirect("/cars");
        });
    });
});
//Login routes
router.get("/login",(req,res)=>{
    res.render("login");
});

router.post("/login",(passport.authenticate("local",{successRedirect:"/cars",
                    failureRedirect:"/login"})),(req,res)=>{

});

//Logout route
router.get("/logout",(req,res)=>{
    req.logout();
    res.redirect("/cars");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports=router;