var mongoose=require("mongoose");
var Car=require("./models/carSchema");
var Comment=require("./models/comments")
var data=[
    {name:"Lamborgini",image:"https://images.unsplash.com/photo-1519245659620-e859806a8d3b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",about:"Blah blah blah"},
    {name:"Porshe",image:"https://images.unsplash.com/photo-1498946168008-9b2e06e76ea0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",about:"Blah blah blah"},
    {name:"BMW",image:"https://images.unsplash.com/photo-1549399542-7e3f8b79c341?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",about:"Blah blah blah"}
    
]

function seedDB(){
    //Remove all campground
    Car.remove({},(err)=>{
        if(err){
            console.log(err);
        }else{
            console.log("removed campground!!");
                //Add campgrounds
            data.forEach((seed)=>{
                Car.create(seed,(err,data)=>{
                    if(err){
                        console.log(err);
                    }else{
                        console.log("added a data");
                        //Create a comment
                        Comment.create(({
                            text:"This car is great",
                            author:"Sexydick69"
                        }),(err,comment)=>{
                            if(err){
                                console.log(err);
                            }else{
                                data.comments.push(comment);
                                data.save();
                                console.log("added comment");
                            }
                        });
                    }
                });
            });
        }
    });
}

module.exports=seedDB;