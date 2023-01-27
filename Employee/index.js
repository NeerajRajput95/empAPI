const express = require("express");
const app = express();
const emplooyeRouter=require('../routers/router');
const cors=require('cors')
const mongoose = require("../database/mongodb");
const { response } = require("express");
const nodemailer=require('nodemailer');
app.use(express.json());
// app.use(emplooyeRouter);
const PORT = 3400;
const sendMail=require('../routers/router');
app.use(emplooyeRouter);
app.set('view engine','ejs');


app.get('/',(req,res)=>{
  res.send(``)
  
})



//
try {
  app.listen(PORT, () => {
    console.log(`connection on ${PORT} server `);
    console.log('Listening at http://localhost:' + PORT + '\n')
  });
   
} catch (error) {
  console.log(error);
}
