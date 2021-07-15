const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const redis = require("redis");

//create a client
let client = redis.createClient();

client.on("connect", function () {
  console.log("connected to redis...");
});

//set port
const port = 4000;

// init app
const app = express();

// view engines

app.engine("handlebars", exphbs({ defaultLayou: "main" }));
app.set("view engine", "handlebars");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(methodOverride("_method"));
app.get("/", function (req, res, next) {
  res.render("searchusers");
});

app.post("/user/search", function (req, res, next) {
  let id = req.body.id;
  client.hgetall(id, function (err, obj) {
    if (!obj) {
      res.render("searchusers", {
        error: "User does not exist",
      });
    } else {
      obj.id = id;
      res.render("details", {
        user: obj,
      });
    }
  });
});
app.get("/user/add", function (req, res, next) {
  res.render("adduser");
});
app.delete("/user/delete/:id", function (req, res, next) {
  let id = req.params.id;
  client.del(id, function (err, reply) {
    if (err) {
      console.log("Error");
    } else {
      res.redirect("/");
    }
    console.log("done");
  });
});
app.post("/user/add", function (req, res, next) {
  let id = req.body.id;
  let first_name = req.body.first_name;
  let last_name = req.body.last_name;
  let email = req.body.email;
  let phone = req.body.phone;
  console.log(id + first_name + last_name);
  client.HMSET(
    id,
    [
      "first_name",
      first_name,
      "last_name",
      last_name,
      "email",
      email,
      "phone",
      phone,
    ],
    function (err, reply) {
      if (err) {
        console.log(err);
      } else {
        console.log(reply);
        res.redirect("/");
      }
    }
  );
});
app.listen(port, function () {
  console.log("server started on port " + port);
});
