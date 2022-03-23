const router = require("express").Router();
const userModel = require("../Models/userschem");
const notificationModem = require("../Models/notificationschem");
//password encryption for later...
const bcrypt = require("bcrypt");
const { intersection } = require("lodash");

//Registration

router.post("/register", async (req, res) => {
  try {
    const user = new userModel({
      email: req.body.email,
      password: req.body.password,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      ville: req.body.ville,
      quartier: req.body.quartier,
    });
    await user.save();
    const notification = new notificationModem({
      userId: user._id,
    });
    notification.save();
    res.status(200).json({
      status: "success",
      user,
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err,
    });
  }
});

//Login
// router.post("/login", async (req, res) => {
//   const user = await userModel.findOne({ email: req.body.email });
//   if (!user) {
//     res.status(404).send("user email not found");
//   } else {
//     if (user.password !== req.body.password) {
//       res.status(400).send("Invalid Password");
//     } else {
//       res.status(200).json(user);
//     }
//   }
// });
//Login
router.post("/login", async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      res.status(404).json({
        status: "failed",
        message: "user email not found",
      });
    } else {
      if (user.password !== req.body.password) {
        res.status(400).json({
          status: "failed",
          message: "Invalid Password",
        });
      } else {
        res.status(200).json({
          status: "success",
          user,
        });
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
