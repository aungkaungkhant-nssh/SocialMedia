const mongoose = require("mongoose");

const tweetSchema = new mongoose.Schema({
    type:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    created:{
        type:Date,
        required:true
    },
    owner:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
    origin:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    likes:[
        {type:mongoose.Types.ObjectId,ref:"User",required:true}
    ]
})

const Tweet = mongoose.model("Tweet",tweetSchema);
exports.Tweet = Tweet;