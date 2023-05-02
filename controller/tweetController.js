const {Tweet}= require("../model/Tweet");
const relationships = require("../pipeline");
const mongoose = require("mongoose");
const {User} = require("../model/User");

exports.addNewTweet = async(req,res)=>{
    const {tweet} = req.body;
    const user = res.locals.user._id;
    if(!tweet) return res.status(400).json({message:"Tweet body required"})
    try{
        let result = new Tweet({
            type:"post",
            body:tweet,
            created:new Date(),
            owner:user,
            likes:[]
        })
        result = await result.save();
        let data = await Tweet.aggregate([
            {$match:{_id:result._id}},
            {
                $lookup:{
                    from:"users",
                    localField:"owner",
                    foreignField:"_id",
                    as:"user"
                }
            },
           
        ])
        res.status(201).json(data[0])

    }catch(err){
        res.status(500).json({message:"Something went wrong"})
    }
}

exports.fetchTweets = async(req,res)=>{
    const limit = 3;
    const page = parseInt(req.query.page)|| 0
    const skip = limit*page
    try{
        let tweets= await Tweet.aggregate([
                    {
                        $match:{
                            $or:[
                                {type:"post"},
                                {type:"share"}
                            ]
                        }
                    },
                    {$skip:skip},
                    {$limit:limit},
                    ...relationships,
                   {$sort:{_id:-1}}
                    ])
                    
        let tweetTotal = await Tweet.aggregate([
            {
                $match:{
                    $or:[
                        {type:"post"},
                        {type:"share"}
                    ]
                },
                
            },
            {
                $count:"total"
            }
        ])
       
        res.status(200).json({tweets,page,limit,count:tweets.length,total:tweetTotal[0]?.total || 0})
    }catch(err){
        res.status(500).json({message:"Something went wrong"})
    }
}
exports.fetchTweet = async(req,res)=>{
    const {id} = req.params;
   
    try{
        let tweet = await Tweet.aggregate([
            {
                $match:{
                  _id:new mongoose.Types.ObjectId(id)
                }
            },
            ...relationships,
        ])
        res.status(200).json(tweet[0])
    }catch(err){
        res.status(500).json({message:"Something went wrong"})
    }
}
exports.deleteTweet = async(req,res)=>{
    const {id}  = req.params;
    const user = res.locals.user._id;

    try{
        let tweet= await Tweet.findOneAndDelete({
            $and:[
                {_id:id},
                {owner:user}
            ]
        })

       if(tweet.type==="post"){
            await Tweet.findOneAndDelete({
                $and:[
                    {
                        origin:tweet._id 
                    },
                    {
                        type:"comment"
                    }
                ]
              
            })
       }
        res.status(200).json(tweet)
    }catch(err){
        res.status(500).json({message:"Something went wrong"})
    }
}

exports.putLike = async(req,res)=>{
    const {id} = req.params;
    const user = res.locals.user._id
   try{
    let tweet = await Tweet.findById(id);
    tweet.likes = tweet.likes || [];
    if(tweet.likes.includes(user)){
        tweet.likes = tweet.likes.filter((t)=>t.toString()!=user)
    }else{
        tweet.likes.push(new mongoose.Types.ObjectId(user));
    }
  
    await Tweet.findOneAndUpdate({_id:id},{...tweet});
    
    return res.status(200).json(tweet.likes)
   }catch(err){
        res.status(500).json({message:err})
   }
}

exports.addNewReply = async(req,res)=>{
    const {id} = req.params;
    const user = res.locals.user._id;
    const {reply} = req.body;

    try{
        let tweet =new Tweet({
            type:"comment",
            body:reply,
            created:new Date(),
            owner:user,
            origin:id,
            likes:[]
        })
        tweet = await tweet.save();
        tweet = await Tweet.aggregate([
            {
                $match:{
                    _id:tweet._id
                }
            },
            {
                $lookup:{
                    from:"users",
                    localField:"owner",
                    foreignField:"_id",
                    as:"user"
                }
            }
        ])
        res.status(201).json(tweet)
    }catch(err){
        res.status(500).json({message:err})
    }
}

exports.addShare = async(req,res)=>{
    const {id} =req.params;
    const {body} = req.body;
    const user = res.locals.user;
    try{
        let tweet =new Tweet({
            type:"share",
            body,
            created:new Date(),
            origin:id,
            owner:user._id,
            likes:[]
        })
        tweet = await tweet.save()
        let data  = await Tweet.aggregate([
                {
                    $match:{_id:tweet._id}
                },
                {
                    $lookup:{
                        from:"users",
                        localField:"owner",
                        foreignField:"_id",
                        as:"user"
                    }
                },
                {
                    $lookup:{
                        from:"tweets",
                        localField:"origin",
                        foreignField:"_id",
                        as:"origin_tweet",
                        pipeline:[
                            {
                                $lookup:{
                                    from:"users",
                                    localField:"owner",
                                    foreignField:"_id",
                                    as:"user"
                                }
                            }
                        ]
                    }
                }
        ])
        res.status(200).json(data[0])
    }catch(err){
        res.status(500).json({message:err})
    }
}

exports.fetchTweetByHandle = async(req,res)=>{
    
    const {handle} = req.params;
   
    const limit = 3;
    const page = parseInt(req.query.page)|| 0
    const skip = limit*page
    try{
        let user = await User.findOne({handle});
        let tweet =  await Tweet.aggregate([
            {
                $match:{
                    owner:user._id
                },

                
            },
            {
                $match:{
                    $or:[
                        {type:"post"},
                        {type:"share"}
                    ]
                }
            },
            {$skip:skip},
            {$limit:limit},
            ...relationships,
           {$sort:{_id:-1}}
        ])
        let ownUserPost = await Tweet.aggregate([
                    {
                        $match:{
                            owner:user._id
                        }
                    },
                    {
                        $match:{
                            $or:[
                                {
                                    type:"post"
                                },
                                {
                                    type:"share"
                                }
                            ]
                        }
                    },
                    {
                        $count:"total"
                    }
        ])
       
        res.status(200).json({tweet,page,limit,count:tweet.length,total:ownUserPost[0]?.total || 0})

    }catch(err){
        res.status(500).json({message:"Something went wrong"})
    }
}

exports.fetchCommentByHandle  = async(req,res)=>{
    const {handle} = req.params;
    const limit = 3;
    const page = parseInt(req.query.page)|| 0
    const skip = limit*page;
    try{
        let user = await User.findOne({handle});
        let comment =  await Tweet.aggregate([
            {
                $match:{
                    $and:[
                        {owner:user._id},
                        {type:"comment"}
                    ]
                },
                
            },
           
            {$skip:skip},
            {$limit:limit},
           
            {$sort:{_id:-1}},   
            ...relationships
        ])
        let ownUserComment = await Tweet.aggregate([
            {
                $match:{
                    $and:[
                        {owner:user._id},
                        {type:"comment"}
                    ]
                },
                
            },
            {
                $count:"total"
            }
        ])
    
        res.status(200).json({comment,page,limit,count:comment.length,total:ownUserComment[0]?.total || 0})

    }catch(err){
        res.status(500).json({message:"Something went wrong"})
    }
}

exports.fetchLikeByHandle = async(req,res)=>{
    const {handle} = req.params;
    const limit = 3;
    const page = parseInt(req.query.page)|| 0
    const skip = limit*page;
 
    try{
        const user =await User.findOne({handle});

        let like = await Tweet.aggregate([
            {
                $match:{
                    likes:user._id
                }
            },
            {$skip:skip},
            {$limit:limit},
         
            {$sort:{_id:-1}},   
            ...relationships
        ])
   
        let ownUserLike = await Tweet.aggregate([
            {
                $match:{
                    likes:user._id
                }
            },
            {
                $count:"total"
            }
        ])
        
        res.status(200).json({like,page,limit,count:like.length,total:ownUserLike[0]?.total || 0})
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Something went wrong"})
    }
}