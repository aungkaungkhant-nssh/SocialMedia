const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    googleId:{
        type:String
    },
    handle:{
        type:String,
        required:true
    },
    password:{
        type:String
    },
    profile:{
        type:String
    },
    followers:[
        {type:mongoose.Types.ObjectId}
    ],
    followings:[
        {type:mongoose.Types.ObjectId}
    ]
})

// userSchema.pre("save",async function(){
//     const salt =await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password,salt);
// })

userSchema.methods.generateToken  = async function(){
    return await jwt.sign({_id:this._id},process.env.JWT_KEY)
}
userSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(password,this.password);
}
const User = mongoose.model("User",userSchema);

exports.User = User;