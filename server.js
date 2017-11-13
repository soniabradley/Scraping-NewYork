const express = require("express");
const bodyParser = require("body-parser");
var methodOverride = require("method-override");
var exphbs = require("express-handlebars");

var PORT = process.env.PORT || 3000;

// Initialize Express
const app = express();


// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// app.use("/", routes);
// Use express.static to serve the public folder as a static directory
app.use(express.static(__dirname + "/public"));
const routes = require("./controllers/router.js");

app.use(methodOverride("_method"));

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/NYHeadlines";
// mongoose.Promise = Promise;
// mongoose.connect(MONGODB_URI, {
//   useMongoClient: true
// });

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
