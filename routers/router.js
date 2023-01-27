const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("../database/mongodb");
const User = require("../scheama/confi");
const emplooye = require("../scheama/confi");
const Router = express.Router();
const nodemailer=require('nodemailer');





const nodemon=async(name,email,token)=> {
 
    const transporter =await nodemailer.createTransport({
      service: 'gmail',
     
      auth: {
       
          user: 'neerajdesh123@gmail.com', // sender address
          pass: 'digjuddgqlrqpjcg'  //digjuddgqlrqpjcg,njetvgkrncrwzdwn
      }
   
  });
  
      let mailer= {
      from: 'neerajdesh123@gmail.com', // sender address
      to: email, // list of receivers
      subject: 'Sending Email using Node.js',
      html:'<p> hii '+name+' plz copy the link and <a href="http://localhost:3400/resetPassword?token='+token+'"> reset password</a>'
      
    }
     transporter.sendMail(mailer,function(error,info){
      if(error){
        console.log(error);
      }
      else{
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        console.log("mail send",info.response);
      }
    })
  }

// Forget Password API
Router.post('/forgetPassword',async(req,resp)=>{
 try{
   const {email}=req.body;
  const emplooye=await User.findOne({email:email});
  console.log(emplooye);
  if(emplooye){

  
 const token = jwt.sign(
    { userId: emplooye.id, email: emplooye.email },
    "secretkeyappearshere",
    { expiresIn: "1h" }
  );
   console.log("rrrrrrrrrrrr",token);
  const data=await User.updateOne({email:email},{$set:{token:token}});
  resp.send("plaz check ur mail reset password");
nodemon(emplooye.name,emplooye.email,token);

  }
  else{
    resp.status(400).send("User doesn't exist");
  }
}
catch(error){
  resp.status(502).json({
    success: false,
    "Status Code": 502,
    errmsg: "Error! Something went wrong.",
  })
}
});
 //Reset password API
Router.get('/resetPassword',async(req,resp)=>{
        try {
          const token=req.query.token;
          console.log("token number",token);
     const tokenData=await User.findOne({token:token});
     console.log("tokendataaaaaa",tokenData);
     if(tokenData){
        const password=req.body.password;
    const newPassword = await bcrypt.hash(password, 10);
      console.log("nnnnnnnnnnnnnnn",newPassword);
      console.log("idddddd",tokenData._id);
    const userData = await User.findByIdAndUpdate({_id:tokenData._id },{$set:{password:newPassword,token:''}},{new:true});
    console.log(userData);
    // console.log("uuuuuuu",userData);
       resp.status(200).json({ success: true,"Status Code": 200,errmsg: "password is reset",data:userData});
      //  resp.status(200).json(userData);
      
     }
     else{
      resp.status(200).json({ success: true,"Status Code": 200,errmsg: "this link has been expired"});
        
     }
    
          
        } 
        catch (error) {
          resp.status(502).json({ success: false,"Status Code": 502,errmsg: "Error! Something went wrong."});
        }
});
Router.post("/signup", async (req, resp, next) => {
  try {
    const { name, email, phone, Department, password } = req.body;
    const hashpass = await bcrypt.hash(password, 10);

    const newEmploye = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      Department: req.body.Department,
      password: hashpass,
    });
    await newEmploye.save();

    resp.status(200).json({
      success: true,
      "Status Code": 200,
      message: "Welcome",
      data: {
        userId: newEmploye.id,
        email: newEmploye.email,
        phone: newEmploye.phone,
        Department: newEmploye.Department,
        password: newEmploye.password,
      },
    });
  } catch (error) {
    resp.status(502).json({
      success: false,
      "Status Code": 502,
      errmsg: "Error! Something went wrong.",
    });
  }
});
//login api
Router.post("/login", async (req, resp, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    resp.status(400).json({ error: "email and password is required" });
  }
  let existUser;
  try {
    existUser = await User.findOne({ email: req.body.email });
  } catch (error) {
    resp.status(400).json({ error: "emailId not exist" });
  }
  //compare hashPassword and plainTextPassword

  const passwordCompair = await bcrypt.compare(password, existUser.password);
  {
    // if (!passwordCompair)
    if (!passwordCompair) {
      const error = new Error("Error! Something went wrong.");
      return next(error);
    }
  }
  //gentrate token
  let token;
  const payload = {
    userId: existUser.id,
    email: existUser.email,
  };
  const secret = "neeraj@1995";
  try {
    token = jwt.sign(payload, secret);
  } catch (err) {
    const error = new Error("Error! Something went wrong.");
    return next(error);
  }
  try {
    resp.status(200).json({
      success: true,
      "Status Code": 200,
      message: "Welcome",
      data: {
        userId: existUser.id,
        email: existUser.email,
        token: token,
      },
    });
  } catch (err) {
    resp.status(502).json({
      success: false,
      "Status Code": 502,
      errmsg: "Error! Something went wrong.",
    });
  }
});

//search api

Router.post("/search", async (req, resp) => {
  try {
    const name = req.query.name;
     console.log(" req",req.query);
    const student = await User.findOne({name:req.query.name});
    console.log("stu",student);
    if (!student) {
      resp.status(404).send({
        success: false,
        "Status Code": 502,
        errmsg: "Error! Something went wrong.",
      });
    } else {
      resp.status(200).send({
        success: true,
        "Status Code": 200,
        message: "Welcome",
        student,
      });
    }
  } catch (err) {
    resp.status(404).send({
      success: false,
      "Status Code": 502,
      errmsg: "Error! Something went wrong.",
    });
  }
});

//add/edit api

Router.patch("/edit/:id", async (req, resp) => {
  try {
    const _id = req.params.id;
    const updateUser = await User.findByIdAndUpdate(_id, req.body);

    resp.status(200).send(updateUser);
  } catch (error) {
    resp.status(500).send(error);
  }
});



//FORGET APi
// Router.post("/forget-password", async (req, resp) => {
//   try {
//     const id = req.params.id;
//     const updateUser = await User.findOne({ id: id });
//     console.log(updateUser);
//     if (updateUser) {
//       const resetApi = `http://localhost:3400/resetPassword:${updateUser.email}`;
//       resp.status(200).json(resetApi);
//     }
//   } catch (error) {
//     resp.status(500).send(error);
//   }
// });

// Router.get("/resetPassword", async (req, resp) => {
//   const id = req.params.id;
//   console.log("xyccc");
//   resp.status(200).send(`<html>
//     <form action="/reset:${id}" method="get">
//         <label for="password">password</label>
//         <input type="text" name="password" >
//         <button>submit</button>
//     </form>
// </html>`);
// });

// Router.get('/reset:email',async(req,resp)=>{
//     const password=req.query.password;
//     console.log("xyz",password);
//     console.log("abc",req.params);
//     const {email}=req.params;
//     const employe = await User.findOne({ email: email });
    
//     console.log("emm",employe);
//     const hashpass = await bcrypt.hash(password, 10);
//     console.log("hass",hashpass);
//     // employe.update()
//     resp.end();
// })
// });

Router.post("/forget/:email", async (req, resp) => {


});

module.exports = Router;
