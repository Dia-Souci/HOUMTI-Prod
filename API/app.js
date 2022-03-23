// Requiring Modules

const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const morgan = require("morgan");
const parser = require("body-parser");

const userRoute = require("./Routes/users");
const authenticationRoute = require("./Routes/auth");
const postsRoute = require("./Routes/posts");
const notificationRoute = require("./Routes/notification");
const ejs = require("ejs");
const http = require("http");
const multer = require("multer");
const fileUpload = require("express-fileupload");
const path = require("path");

const cors = require("cors");

//intializing
const app = express();
app.use(
  cors({
    origin: "*",
  })
);
dotenv.config();
app.use(morgan("common"));
app.use(express.json());
app.set("view engine", "ejs");
app.use(parser.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
  })
);

app.use(express.static("public"));

//CORS

//Database Connection
const DBurl = process.env.MONGO_URL;
mongoose.connect(
  DBurl,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  async () => {
    await console.log(`Successfully conncted to mongoDB database`.cyan.bold);
  }
);


//Middlewares Temporarly ...

app.use("/api/posts", postsRoute);
app.use("/api/users", userRoute);
app.use("/api/auth", authenticationRoute);
app.use("/api/notifications", notificationRoute);

//views rendering upcoming (unfinished admin...)
const url = "http://localhost:3000/api/";
let users = [];
let currentUser;
let posts = [];
app.get("/admin-dash/user-post-delete/:id", (req, res) => {
  let Url = url + "posts/delete" + req.params.id;
  let donnee = 0;
  http.delete(Url, (resp) => {
    console.log(resp.statusCode);
    donnee = resp.statusCode;
  });
  if (donnee === 200) {
    res.redirect("/admin-dash");
  } else {
    res.render("dashboard_error");
  }
});
app.get("/admin-dash", (req, res) => {
  let Url = url + "users/all/";

  http.get(Url, async (resp) => {
    console.log(resp.statusCode);
    await resp.on("data", (data) => {
      users = JSON.parse(data);
      console.log(JSON.parse(data));
    });
  });

  res.render("dashboard_users", {
    users: users,
  });
});
app.get("/admin-dash/:id", async (req, res) => {
  let Url = url + "posts/posts-user/" + req.params.id;

  http.get(Url, async (resp) => {
    console.log(resp.statusCode);
    resp.on("data", (data) => {
      posts = JSON.parse(data);
      console.log(JSON.parse(data));
    });
  });
  Url = url + "users/user-id/" + req.params.id;
  http.get(Url, async (resp) => {
    console.log(resp.statusCode);
    resp.on("data", (data) => {
      currentUser = JSON.parse(data);
      console.log(JSON.parse(data));
    });
  });
  res.render("dashboard_user_post", {
    currentUser: currentUser,
    posts: posts,
  });
});


// working interface

app.get("/main-feed", (req, res) => {
  res.sendFile(__dirname + `/main-feed.html`);
});
app.get("/profile", (req, res) => {
  res.sendFile(__dirname + "/profile.html");
});
app.get("/messages", (req, res) => {
  res.sendFile(__dirname + "/messages.html");
});
app.get("/settings", (req, res) => {
  res.sendFile(__dirname + "/settings.html");
});
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

app.get("/post-template", (req, res) => {
  res.sendFile(__dirname + "/post-template.html");
});

//in case 

app.use("/", (req, res, next) => {
  res.status(404).json("page not found");
  next();
});

//lunching server with app.listen definit
let Port = 3000;
app.listen(
  Port,
  console.log(`Server is running on port ${Port}...`.yellow.bold)
);
