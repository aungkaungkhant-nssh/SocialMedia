
const {User} = require("../model/User")
const bcrypt = require("bcryptjs");

exports.userRegister = async(req,res)=>{
    const {name,handle,password} = req.body;
    if(!name || !handle || !password) return res.status(400).json({message:"Please Fill Information"});
    if(!(password.length >= 8 && password.length <= 16)) return res.status(402).json({message:"Password must be greater than 8 and less than 16"})

    try{
        const salt =await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password,salt);
        let user = new User({name,handle,password:hash});
        user = await user.save();
        let token =await user.generateToken();
        res.status(201).json({token,user})
    }catch(err){
      
        res.status(500).json({message:"Something went wrong"});
    }
   
}

exports.userLogin = async(req,res)=>{
    const {handle,password} = req.body;
    if(!handle || !password) return res.status(400).json({message:"Please Fill Information"});

    try{
        let user = await User.findOne({handle});
        if(!user) return res.status(403).json({message:"User not found"});
        if(!await user.matchPassword(password)) return res.status(403).json({message:"Incorrect Password"});

        let token = await user.generateToken();
        res.status(200).json({token,user})
    }catch(err){
        res.status(500).json({message:"Something went wrong"})
    }

}

exports.getUser = async(req,res)=>{
    let user = res.locals.user;
    try{
        user = await User.findById(user._id);
        if(!user) return res.status(404).json({message:"User not found"});
        res.status(200).json({user})
    }catch(err){
        res.status(500).json({message:"Something went wrong"});
    }
}

exports.getSearchUser = async(req,res)=>{
    const {searchUser} = req.body; 
    
    try{
        let user = await User.find({
                $or:[
                    {
                        name:{$regex:searchUser,"$options": "i"}
                    },
                    {
                        handle:{$regex:searchUser,"$options": "i"}
                    }
                ]
        })
   
        res.status(200).json(user)
    }catch(err){
        res.status(500).json({message:"Something went wrong"})
    }
}

exports.getHandleSearchUser = async(req,res)=>{
    const {handle} = req.params;
    try{
        let user =  await User.aggregate([
            {
                $match:{handle}
            },
            {
                $lookup:{
                    from:"users",
                    localField:"followings",
                    foreignField:"_id",
                    as:"following_users"
                }
            },
            {
                $lookup:{
                    from:"users",
                    localField:"followers",
                    foreignField:"_id",
                    as:"follower_users"
                }
            }
        ])
        res.status(200).json(user[0])
    }catch(err){
        res.status(500).json({message:"Something went wrong"})
    }
}

exports.putFollow = async(req,res)=>{
    let actorId = res.locals.user._id;
    const {targetId} = req.params;
    try{
       let targetUser =    await  User.findById(targetId);
       let actorUser =     await User.findById(actorId);
       if(!targetUser) return res.status(400).json({message:"User not found"});
       targetUser.followers = targetUser.followers || []
       actorUser.followings = actorUser?.followings || []
       if(!targetUser.followers.includes(actorUser._id)){
          
        targetUser.followers.push(actorUser._id);
        actorUser.followings.push(targetUser._id)
       }else{
        targetUser.followers = targetUser.followers.filter((f)=>f != actorId );
        actorUser.followings = actorUser.followings.filter((f)=> f!=targetId)
       }

       await User.findOneAndUpdate({_id:actorUser._id},actorUser)
       await User.findOneAndUpdate({_id:targetId},targetUser);
       res.status(200).json({
        followers:targetUser.followers,
        followings:actorUser.followings
       })
    }catch(err){
        console.log(err)
        res.status(500).json({message:err})
    }
}

exports.updateProfile= async(req,res)=>{
    const {id} = req.params;
 
    const {name,password,profile} = req.body;

   
    if(!name) return res.status(400).json({message:"Name required"})
    let data ={name};
    if(password){
        const hash = await bcrypt.hash(password,10);
        data.password = hash;
    }
    if(profile){
        data.profile = profile
    }
    try{
          let user =  await User.findOneAndUpdate({_id:id},data);
          user = await User.findById(user._id);
          res.status(200).json(user)
    }catch(err){
        res.status(500).json({message:"Something went wrong"})
    }
}

