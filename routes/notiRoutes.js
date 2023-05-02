const express = require("express");
const router = express.Router();
const {auth}  = require("../middleware/auth");
const { postNoti, getNoti, markOneNotiRead, markAllNotiRead, destroyNoti } = require("../controller/notiController");

router.post("/",auth,postNoti)
router.get("/",auth,getNoti)
router.put("/:id",auth,markOneNotiRead)
router.put("/",auth,markAllNotiRead)
router.delete("/:id",auth,destroyNoti)
module.exports = router;