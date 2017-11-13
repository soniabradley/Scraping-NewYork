// dependencies
var express = require("express");
var handlebars = require("express-handlebars");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var cheerio = require("cheerio")
var request = require("request")


var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();


// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/NYHeadlines";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
