var express=require("express");
var app=express();
var mongoose=require("mongoose");
var bodyParser=require("body-parser");
var methodOverride=require("method-override");

mongoose.connect("mongodb://localhost/car_project");
app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

var carSchema=new mongoose.Schema({
    name:String,
    image:String,
    about:String,
    created:{type:Date,default:Date.now}
});

var Car=mongoose.model("Car",carSchema);

//Basic Route
app.get("/",(req,res)=>{
    res.redirect("/cars");
});

//Find route
app.get("/cars",(req,res)=>{
    Car.find({},(err,found)=>{
        if(err){
            console.log(err);
        }else{
            res.render("index",{cars:found});
        }
    });
});

app.get("/cars/new",(req,res)=>{
    res.render("new");
})
//create route
app.post("/cars",(req,res)=>{
    Car.create(req.body.car,(err,newBlog)=>{
        if(err){
            res.render("new");

        }else{
            res.redirect("/cars");
        }
    });
});

// Searching car by id
app.get("/cars/:id",(req,res)=>{
    Car.findById(req.params.id,(err,foundCar)=>{
        if(err){
            console.log(err);
            res.redirect("/cars");
        }else{
            res.render("show",{cars:foundCar})
        };
    });
});

//Edit Route
app.get("/cars/:id/edit",(req,res)=>{
    Car.findById(req.params.id,(err,foundCar)=>{
        if(err){
            console.log(err);
            res.redirect("/cars");
        }else{
            res.render("edit",{car:foundCar});
        }
    });
});

//Update Route

app.put("/cars/:id",(req,res)=>{
    Car.findByIdAndUpdate(req.params.id,req.body.car,(err,UpdateBlog)=>{
        if(err){
            res.redirect("/cars");
        }else{
            res.redirect("/cars/"+req.params.id);
        }
    });
});

//Destroy Route
app.delete("/cars/:id/delete",(req,res)=>{
    Car.findByIdAndRemove(req.params.id,(err,deleteCar)=>{
        if(err){
            console.log(err);
            res.redirect("/cars/"+req.params.id);
        }else{
            res.redirect("/cars");
        }
    });
});

//Defining default route

var port=process.env.PORT || 3000;

//Listen route

app.listen(port,()=>{
    console.log(`Listening on ${port}`);
});
