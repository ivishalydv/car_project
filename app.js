var express=require("express");
var app=express();
var mongoose=require("mongoose");
var bodyParser=require("body-parser");
var methodOverride=require("method-override");
var Car=require("./models/carSchema"); 
var Comment=require("./models/comments"); 
var seedDB=require("./seeds");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var User=require("./models/user")

mongoose.connect("mongodb://localhost/car_project_2");


seedDB();
app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

//PASSPORT CONFIG
app.use(require("express-session")({
    secret:"Once again",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());;
app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    next();
});


//Basic Route
app.get("/",(req,res)=>{
    res.redirect("/cars");
});

//Find route
app.get("/cars",(req,res)=>{
    Car.find({},(err,found)=>{
        var currentUser=req.user
        if(err){
            console.log(err);
        }else{
            res.render("index",{cars:found,currentUser:req.user});
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
            res.render("campground/new");

        }else{
            res.redirect("/cars");
        }
    });
});

// Searching car by id
app.get("/cars/:id",(req,res)=>{
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
app.get("/cars/:id/edit",(req,res)=>{
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

//New comment route
app.get("/cars/:id/comments/new",isLoggedIn,(req,res)=>{
    Car.findById(req.params.id,(err,car)=>{
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{car:car});
        }
    })
});

//Commment Post route
app.post("/cars/:id/comments",isLoggedIn,(req,res)=>{
    Car.findById(req.params.id,(err,foundCar)=>{
        if(err){
            console.log(err);
            res.redirect("/cars");
        }else{
            Comment.create(req.body.comment,(err,comment)=>{
                if(err){
                    console.log(err);
                }else{
                    foundCar.comments.push(comment);
                    foundCar.save();
                    res.redirect("/cars/"+foundCar._id);
                }
            })
        }
    })
})

//AUTH ROUTES

app.get("/register",(req,res)=>{
    res.render("register");
});


//Handle sign up logic

app.post("/register",(req,res)=>{
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
app.get("/login",(req,res)=>{
    res.render("login");
});

app.post("/login",(passport.authenticate("local",{successRedirect:"/cars",
                    failureRedirect:"/login"})),(req,res)=>{

});

//Logout route
app.get("/logout",(req,res)=>{
    req.logout();
    res.redirect("/cars");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

//Defining default route

var port=process.env.PORT || 3000;

//Listen route

app.listen(port,()=>{
    console.log(`Listening on ${port}`);
});
