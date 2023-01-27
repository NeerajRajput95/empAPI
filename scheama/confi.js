const mongodb=require("mongoose");


const Data=mongodb.Schema({
name:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true
},
phone:{
    type:Number,
    required:true
},
Department:{
    type:String,
    required:true
},
password:{
    type:String,
    required:true
},
token:{
    type:String,
    default:''
},
})

const emplooye=new mongodb.model('EMPLOYEE',Data);
module.exports=emplooye;