const express = require("express");
const { userRegister ,userLogin,getUser,getSearchUser,getHandleSearchUser, putFollow,updateProfile} = require("../controller/userController");
const { auth } = require("../middleware/auth");
const router = express.Router();

router.put("/:targetId/follow",auth,putFollow);
router.post("/register",userRegister);
router.post("/login",userLogin);

router.get("/",auth,getUser)
router.post("/search",getSearchUser);

router.get("/:handle",getHandleSearchUser);
router.put("/:id/profile",auth,updateProfile);

module.exports = router;