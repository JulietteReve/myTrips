var express = require("express");
var router = express.Router();
const userModel = require("../models/user");

/* GET users listing. */
// router.get("/", async (req, res, next) => {
//   try {
//     const users = await userModel.find();
//     res.send(users);
//   } catch (err) {
//     res.send(err.messages);
//   }
// });

module.exports = router;
