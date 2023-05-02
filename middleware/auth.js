

const jwt = require("jsonwebtoken")
exports.auth = async(req,res,next)=>{
    const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

    if(!token)return  res.status(401).json({message:"Unauthorized"})
    try{
        const user = jwt.verify(token,process.env.JWT_KEY);
     
        if(!user) return res.status(401).json({message:"Invalid Token"});
        res.locals.user = user;
        next();
    }catch(err){
        res.status(401).json({message:"Invalid Token"});
    }
}   