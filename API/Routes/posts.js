const router = require("express").Router();
const postModel = require("../Models/postschem");
const lo = require("lodash");
const notificationModel = require("../Models/notificationschem");
const userModel = require("../Models/userschem");
const path = require("path");
//create  a post

router.post("/create", async (req, res) => {
  try {
    const newPost = new postModel(req.body);
    await newPost.save();
    res.status(200).json(newPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update  a post
router.put("/update/:id", async (req, res) => {
  const post = await postModel.findById(req.params.id);
  if (req.body.userId === post.userId || req.body.isAdmin) {
    try {
      const updatedPost = await postModel.findByIdAndUpdate(post._id, {
        $set: req.body,
      });
      res.status(200).json(updatedPost);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you can update only your posts");
  }
});
//delete  a post
router.delete("/delete/:id", async (req, res) => {
  const post = await postModel.findById(req.params.id);
  if (req.body.userId === post.userId || req.body.isAdmin) {
    try {
      const updatedPost = await postModel.findByIdAndDelete(post._id);
      res.status(200).json("Post Deleted");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you can delete only your posts");
  }
});

//get  a post

router.get("/post/:id", async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all posts of a user    *updated unverrified with postman*

router.get("/posts-user/:id", async (req, res) => {
  try {
    const post = await postModel.find({ userId: req.params.id });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//like a post
router.put("/like/:id", async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);
    const user = await userModel.findOne({ _id: req.body.userId });

    console.log("im here");
    if (!post.likes.includes(req.body.userId)) {
      const msg = `the user ${user.username} has liked your ${post.type} ${post.title}`;
      await notificationModel.findOneAndUpdate(
        { userId: post.userId },
        { $push: { elements: { content: msg, seen: false } } }
      );
      await post.updateOne({ $push: { likes: req.body.userId } });

      res.status(200).json("Liked");
    } else {
      const msg = `the user ${user.username} has unliked your ${post.type} ${post.title}`;
      await notificationModel.findOneAndUpdate(
        { userId: post.userId },
        { $push: { elements: { content: msg, seen: false } } }
      );
      await post.updateOne({ $pull: { likes: req.body.userId } });

      res.status(200).json("UnLiked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//dislike a post
router.put("/dislike/:id", async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);
    const user = await userModel.findOne({ _id: req.body.userId });

    if (!post.dislikes.includes(req.body.userId)) {
      const msg = `the user ${user.username} has disliked your ${post.type} ${post.title}`;
      await notificationModel.findOneAndUpdate(
        { userId: post.userId },
        { $push: { elements: { content: msg, seen: false } } }
      );

      await post.updateOne({ $push: { dislikes: req.body.userId } });

      res.status(200).json("disLiked (y)");
    } else {
      const msg = `the user ${user.username} has Undisliked your ${post.type} ${post.title}`;
      await notificationModel.findOneAndUpdate(
        { userId: post.userId },
        { $push: { elements: { content: msg, seen: false } } }
      );

      await post.updateOne({ $pull: { dislikes: req.body.userId } });

      res.status(200).json("UnDisLiked (y)");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//have interst in a post

router.put("/interest/:id", async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);
    const user = await userModel.findOne({ _id: req.body.userId });

    if (!post.interested.includes(req.body.userId)) {
      const msg = `the user ${user.username} has interest in your ${post.type} ${post.title}`;
      await notificationModel.findOneAndUpdate(
        { userId: post.userId },
        { $push: { elements: { content: msg, seen: false } } }
      );

      await post.updateOne({ $push: { interested: req.body.userId } });

      res.status(200).json("intersted");
    } else {
      const msg = `the user ${user.username} has lost interest in your ${post.type} ${post.title}`;
      await notificationModel.findOneAndUpdate(
        { userId: post.userId },
        { $push: { elements: { content: msg, seen: false } } }
      );

      await post.updateOne({ $pull: { interested: req.body.userId } });

      res.status(200).json("unintersted");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//get posts by "ville"      *updated unverrified with postman*

router.get("/posts-city/:city", async (req, res) => {
  try {
    const post = await postModel.find({ postville: req.params.city });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get posts by "ville/quartier" *updated unverrified with postman*

router.get("/posts-ville-quartier/:city/:hood", async (req, res) => {
  try {
    const post = await postModel.find({
      postville: req.params.city,
      postquartier: req.params.hood,
    });
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//comment a post     *Unverrified with postman*
router.put("/comment/:id", async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);
    const user = await userModel.findOne({ _id: req.body.userId });
    let comment = req.body.comment;
    const msg = `the user ${user.username} has commented on your ${post.type} ${post.title} by ${comment} `;
    await notificationModel.findOneAndUpdate(
      { userId: post.userId },
      { $push: { elements: { content: msg, seen: false } } }
    );

    await post.updateOne({
      $push: {
        comments: { userId: req.body.userId, content: req.body.comment },
      },
    });

    res.status(200).json("Commented");
  } catch (err) {
    res.status(500).json(err);
  }
});

//participate     *verrified with postman*
router.put("/participate/:id", async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);
    const user = await userModel.findOne({ _id: req.body.userId });

    if (!post.participant.includes(req.body.userId)) {
      const msg = `the user ${user.username} is participating in your ${post.type} ${post.title}`;
      await notificationModel.findOneAndUpdate(
        { userId: post.userId },
        { $push: { elements: { content: msg, seen: false } } }
      );

      await post.updateOne({ $push: { participant: req.body.userId } });
      res.status(200).json("participating");
    } else {
      const msg = `the user ${user.username} has declined his participation in your ${post.type} ${post.title}`;
      await notificationModel.findOneAndUpdate(
        { userId: post.userId },
        { $push: { elements: { content: msg, seen: false } } }
      );

      await post.updateOne({ $pull: { participant: req.body.userId } });
      res.status(200).json("not participating");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/vote/:id/:option", async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id);
    const objVote = { option: req.params.option, user: req.body.userId };
    const array = post.voters;
    console.log("the array", array);
    console.log("im here 1");
    let test = array.find((element) => element.user === req.body.userId);
    console.log("im here 55");
    const user = await userModel.findOne({ _id: req.body.userId });

    console.log(test);
    if (!test) {
      console.log("im here 1");
      const msg = `the user ${user.username} has voted in your ${post.type} ${post.title}`;
      await notificationModel.findOneAndUpdate(
        { userId: post.userId },
        { $push: { elements: { content: msg, seen: false } } }
      );
      console.log("im here 2");
      await post.updateOne({ $push: { voters: objVote } });
      console.log("im here 3");
      res.status(200).json("voted");
    } else {
      console.log("im here 1");
      const msg = `the user ${user.username} has unvoted in your ${post.type} ${post.title}`;
      await notificationModel.findOneAndUpdate(
        { userId: post.userId },
        { $push: { elements: { content: msg, seen: false } } }
      );
      console.log("im here 2");
      await post.updateOne({ $pull: { voters: objVote } });
      console.log("im here 3");
      res.status(200).json("unvoted");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/upload", (req, res) => {
  console.log("here");
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json("No files were uploaded.");
  }

  // Accessing the file by the <input> File name="target_file"
  let targetFile = req.files.image;
  console.log("uploadedFile", targetFile);

  //mv(path, CB function(err))
  targetFile.mv(
    path.join(__dirname, "/../public/images", targetFile.name),
    (err) => {
      if (err) return res.status(500).json(err);

      res.status(200).json({
        message: "File uploaded!",
        file: targetFile.name,
      });
    }
  );
});

module.exports = router;
