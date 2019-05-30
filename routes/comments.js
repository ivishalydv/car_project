var express=require("express");
var router=express.Router();
var Car=require("../models/carSchema");
var Comment=require("../models/comments");


//New comment route
router.get("/cars/:id/comments/new",isLoggedIn,(req,res)=>{
    Car.findById(req.params.id,(err,car)=>{
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{car:car});
        }
    })
});

//Commment Post route
router.post("/cars/:id/comments",isLoggedIn,(req,res)=>{
    Car.findById(req.params.id,(err,foundCar)=>{
        if(err){
            console.log(err);
            res.redirect("/cars");
        }else{
            Comment.create(req.body.comment,(err,comment)=>{
                if(err){
                    console.log(err);
                }else{
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    comment.save();
                    foundCar.comments.push(comment);
                    foundCar.save();
                    res.redirect("/cars/"+foundCar._id);
                }
            })
        }
    });
});
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
module.exports=router;