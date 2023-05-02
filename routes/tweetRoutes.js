const express = require("express");
const { addNewTweet, fetchTweets, deleteTweet, putLike, fetchTweet, addNewReply, addShare, fetchTweetByHandle,fetchCommentByHandle, fetchLikeByHandle } = require("../controller/tweetController");
const router = express.Router();
const {auth}  = require("../middleware/auth");

router.post("/",auth,addNewTweet);
router.get("/",fetchTweets);
router.delete("/:id",auth,deleteTweet);
router.put("/:id/like",auth,putLike);
router.get("/:id",fetchTweet);
router.post("/:id/reply",auth,addNewReply);
router.post("/:id/share",auth,addShare);
router.get("/user/:handle",fetchTweetByHandle);
router.get("/comment/:handle",fetchCommentByHandle);
router.get("/like/:handle",fetchLikeByHandle)
module.exports = router