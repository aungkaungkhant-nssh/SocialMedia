const express= require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");
require("dotenv").config();
app.use(cors());
const userRoutes = require("./routes/userRoutes");
const tweetRoutes = require("./routes/tweetRoutes");
const notiRoutes = require("./routes/notiRoutes");
const passport = require("passport");
const path = require("path");
const session = require('express-session');
require('./passportsetup');
app.use(session({
  secret: process.env.JWT_KEY,
  resave: false,
  saveUninitialized: false
}));



app.use(passport.initialize());
app.use(passport.session());
 

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
   res.redirect(`${process.env.CLIENT_DOMAIN}/login?id=${req.user._doc._id}&token=${req.user.token}`)
  }
);

app.use("/api/user",userRoutes);
app.use("/api/tweet",tweetRoutes);
app.use("/api/noti",notiRoutes);


app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.cme43aq.mongodb.net/${process.env.DB_DEFAULT_DATABASE}?retryWrites=true&w=majority`)
.then(()=>{
  let server = app.listen(process.env.PORT,()=>{
    console.log(`Server is running on PORT ${process.env.PORT}`)
  })
  const io = new Server(server,{cors:{origin:"*"}})
  io.on("connection",(socket)=>{
     socket.on("joinUser",(userId)=>{
        socket.join(userId)
     })
     socket.on("sendNoti",(notis)=>{
  
      socket.in(notis[0].owner).emit("recieveNoti",notis[0])
     })
  })
 })   
 .catch((err)=>console.log(err))


