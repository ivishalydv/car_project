var express=require("express");
var router=express.Router();
var Car=require("../models/carSchema");
var Comments=require("../models/comments");

//Find route
router.get("/cars",(req,res)=>{
    Car.find({},(err,found)=>{
        var currentUser=req.user
        if(err){
            console.log(err);
        }else{
            res.render("index",{cars:found,currentUser:req.user});
        }
    });
});
router.get("/cars/new",isLoggedIn,(req,res)=>{
    res.render("new");
})
//create route
router.post("/cars",isLoggedIn,(req,res)=>{
    Car.create(req.body.car,(err,newBlog)=>{
        if(err){
            res.render("campground/new");

        }else{
            res.redirect("/cars");
        }
    });
});

// Searching car by id
router.get("/cars/:id",(req,res)=>{
    Car.findById(req.params.id).populate("comments").exec((err,foundCar)=>{
        if(err){
            console.log(err);
            res.redirect("/cars");
        }else{
            res.render("campground/show",{cars:foundCar})
        };
    });
});

//Edit Route
router.get("/cars/:id/edit",(req,res)=>{
    Car.findById(req.params.id,(err,foundCar)=>{
        if(err){
            console.log(err);
            res.redirect("/cars");
        }else{
            res.render("campground/edit",{car:foundCar});
        }
    });
});

//Update Route

router.put("/cars/:id",(req,res)=>{
    Car.findByIdAndUpdate(req.params.id,req.body.car,(err,UpdateBlog)=>{
        if(err){
            res.redirect("/cars");
        }else{
            res.redirect("/cars/"+req.params.id);
        }
    });
});

//Destroy Route
router.delete("/cars/:id/delete",(req,res)=>{
    Car.findByIdAndRemove(req.params.id,(err,deleteCar)=>{
        if(err){
            console.log(err);
            res.redirect("/cars/"+req.params.id);
        }else{
            res.redirect("/cars");
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