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
var commentRoutes=require("./routes/comments");
var carRoutes=require("./routes/cars");
var authRoutes=require("./routes/index");


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

app.use(authRoutes);
app.use(carRoutes);
app.use(commentRoutes);

//Defining default route

var port=process.env.PORT || 3000;

//Listen route

app.listen(port,()=>{
    console.log(`Listening on ${port}`);
});
