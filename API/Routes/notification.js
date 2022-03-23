const notificationModel = require("../Models/notificationschem");
const router = require("express").Router();

//get notifications for a user

router.get("/:id", async (req, res) => {
  try {
    const notif = await notificationModel.find({ userId: req.params.id });
    res.status(200).json(notif);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/switch/:id", async (req, res) => {
  try {
    let notif = await notificationModel.find({ userId: req.params.id });

    let array = notif[0].elements;
    console.log(array.length);
    array.forEach((ele) => {
      ele.seen = true;
    });
    await notificationModel.updateOne(
      { userId: req.params.id },
      { $set: { elements: array } }
    );
    notif = await notificationModel.find({ userId: req.params.id });
    res.status(200).json(notif);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
