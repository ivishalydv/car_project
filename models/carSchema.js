var mongoose=require("mongoose");

var carSchema=new mongoose.Schema({
    name:String,
    image:String,
    about:String,
    created:{type:Date,default:Date.now},
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ]
});

var Car=mongoose.model("Car",carSchema);
module.exports=Car;