const mongoose = require("mongoose");

const notiSchema  = new mongoose.Schema({
    type:{
        type:String,
        required:true
    },
    actor:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true, 
    },
    msg:{
        type:String,
        required:true
    },
    target:{
        type:mongoose.Types.ObjectId,
        ref:"Tweet"
    },
    owner:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    read:{
        type:Boolean,
        default:false
    },
    created:{
        type:Date,
    }
})

const Noti = mongoose.model("Noti",notiSchema);

exports.Noti = Noti