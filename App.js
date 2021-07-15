const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const redis = require("redis");

//set port
const port = 4000;

// init app
const app = express();

// view engines

app.engine("handlebars", exphbs({ defaultLayou: "main" }));
app.set("view engine", "handlebars");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(methodOverride("method"));
app.get("/", function (req, res, next) {
  res.render("searchusers");
});
app.listen(port, function () {
  console.log("server started on port " + port);
});
