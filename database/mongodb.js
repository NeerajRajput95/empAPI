const mongodb=require("mongoose");

const mongoose=mongodb.connect('mongodb://localhost:27017/leptonmaps').then(()=>{
    console.log('connect to mongodb');
})
.catch((err)=>{
    console.log("something error in mogoose connection");
});

module.exports=mongoose;



