const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const {User} = require("./model/User")
require('dotenv').config()


passport.serializeUser(function(user, done) {
   
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
   
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK
  },
  function(accessToken, refreshToken, profile, done) {

    User.findOne({googleId:profile.id})
    .then(async(existUser)=>{
        if(existUser){
          const updateUser ={
            name:profile.displayName,
            profile:existUser.profile ||  profile._json.picture,
            handle:profile.name.givenName
          }
          let loginUser = await User.findOneAndUpdate(
            {_id:existUser._id},
            {$set:updateUser},
            {new:true}
          )
          let token = await existUser.generateToken();
          
          done(null,{...loginUser,token})
        }else{
          new User({
            googleId:profile.id,
            name:profile.displayName,
            profile:profile._json.picture,
            handle:profile.name.givenName
          })
          .save()
          .then(async(user)=>{
            let token = await user.generateToken();
          
            done(null,{...user,token})
         
          })
          .catch((err)=>console.log(err))
        }
    }).catch((err)=>console.log(err))
  }
));