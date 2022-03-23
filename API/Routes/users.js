const router = require("express").Router();
const userModel = require("../Models/userschem");

//Update user
router.put("/update/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      let user = await userModel.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      user = await userModel.findById(req.params.id);
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you can only update your account");
  }
});

//delete user
router.delete("/delete/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await userModel.findByIdAndDelete(req.params.id);
      res.status(200).json("user deleted");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you can only delete your account");
  }
});

//get user by id   *updated unverrified with postman*
router.get("/user-id/:id", async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get user by username  *updated unverrified with postman*
router.get("/user-name/:username", async (req, res) => {
  try {
    const user = await userModel.find({ username: req.params.username });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all users    *updated unverrified with postman*
router.get("/all/", async (req, res) => {
  try {
    const user = await userModel.find();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
