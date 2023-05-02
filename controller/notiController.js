const { Noti } = require("../model/Noti");
const { Tweet } = require("../model/Tweet");
const mongoose = require("mongoose")
exports.postNoti = async(req,res)=>{
    const {type,target} = req.body;
    const user = res.locals.user;
    try{
        const tweet = await Tweet.findById(target);
        if(tweet.owner != user._id){
            let noti = new Noti({
                type,
                msg:`${type} your tweet`,
                actor:user._id,
                target,
                owner:tweet.owner,
                read:false,
                created:new Date()
            })
            noti = await noti.save();
            noti  = await Noti.aggregate([
                {
                    $match:{
                      _id:noti._id
                    }
                },
                {
                    $sort: { _id: -1 },
                },
                {
                    $lookup:{
                        from:"users",
                        localField:"actor",
                        foreignField:"_id",
                        as:"user"
                    }
                }
            ])
            res.status(200).json(noti)
        }else res.status(200).json([])
      
        
    }catch(err){
        res.status(500).json({messge:"Something went wrong"})
    }
}

exports.getNoti =async(req,res)=>{
    const user = res.locals.user
 
    try{
        const noti  = await Noti.aggregate([
                {
                    $match:{
                        owner:new mongoose.Types.ObjectId(user._id)
                    }
                },
                {
					$sort: { _id: -1 },
				},
                {
                    $lookup:{
                        from:"users",
                        localField:"actor",
                        foreignField:"_id",
                        as:"user"
                    }
                },
                
        ])
        let notiCount = await Noti.aggregate([
            {
                $match:{
                    owner:new mongoose.Types.ObjectId(user._id)
                }
            },
            {
                $count:"total"
            }
        ])
        res.status(200).json(noti)
    }catch(err){
        res.status(500).json({message:"Something went wrong"})
    }
}

exports.markOneNotiRead = async(req,res)=>{
    const {id} = req.params;
    try{
        await Noti.findOneAndUpdate({_id:id},{read:true});
       return res.status(200).json({ msg: "noti marked read" });
    }catch(err){
        res.status(500).json({message:"Something went wrong"})
    }
}

exports.markAllNotiRead =async(req,res)=>{
    const user = res.locals.user;
    try{
        await Noti.updateMany({owner:user._id},{read:true})
        return res.status(200).json({msg:"noti marked all read"})
    }catch(err){
        res.status(500).json({message:"Something went wrong"})
    }
}

exports.destroyNoti = async(req,res)=>{
    const {id} = req.params;
    try{
        let noti =await Noti.findOneAndDelete({_id:id});
        return res.status(200).json(noti)
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Something went wrong"})
    }
}