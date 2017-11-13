
// dependencies
var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Content = require("../models/model.js");
const cheerio = require("cheerio");
const request = require("request");

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsscrapper";
mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});

//listen to GET request

router.get("/", function(req, res){
    // remove all article that is user not saved from database    
    Content.remove({"saved": false}).then(function(){
        console.log("Clear documents");
    });
    res.render("index");
});

router.get("/art", function(req, res){
    //extract data from mongoDB and send to handlebars    - outside request         
    Content.find({"saved" : false}).then(function(result){
        // console.log(result);
        res.render("index", {result: result});
    });
})

//listen to /getnews GET request and save content to databse
router.get("/getnews", function(req, res){
    //send request to reddit
    request("https://www.reddit.com/r/Bitcoin/", function(err, response, data){
        // data has form obj {resultArr: [{title:"abc", url: "abc"},.....]}
        // var obj = {
        //     resultArr: []
        // };
        const $ = cheerio.load(data);
        $("p.title").find("a.title").each(function(i, element){
            //scrape new contents
            var title = $(this).text();
            var data_url = $(this).attr("data-href-url");
            if(data_url[0] == "/") {
                data_url = "https://www.reddit.com" + data_url;
            } else {
                data_url = $(this).attr("data-href-url");                
            }
            var content = {
                // id: "modal" + i,
                title: title,
                url: data_url
            }
            // obj.resultArr.push(content);
            // console.log(obj);
            //save content to mongoDB database
            Content.create(content).then(function(dbContent){
                // console.log("Content saved!");
            })
            .catch(function(err){
                console.log(err.message);
            });
        }); //end each loop
    });
    // wait 3s for scrapping web content
    setTimeout(function(){
        //extract data from mongoDB and send to handlebars    - outside request         
    Content.find({"saved" : false}).then(function(result){
        res.render("index", {result: result});
    });
    },4000);
});

//POST request when click save button
router.get("/getArticle", function(req, res){
    Content.find({"saved" : true}).then(function(result){
        res.render("Article", {result: result});
    })
});

//GET to save article to database
router.get("/saveArticle/:_id", function(req, res){
    console.log("Hello " + req.params._id);
    Content.findOneAndUpdate({_id: req.params._id},{saved: true})
    .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        console.log("Updated");
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        console.log("Error");
      });
    res.redirect("/art")
})

//GET to delete article to database
router.get("/deleteArticle/:_id", function(req, res){
    // console.log("Hello " + req.params._id);
    Content.findOneAndRemove({_id: req.params._id})
    .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        console.log("Deleted");
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        console.log("Error");
      });
      res.redirect("/getArticle");
});

//addNote
router.post("/addNote/:_id", function(req, res){
    Content.findOneAndUpdate({_id: req.params._id}, {note: req.body.comment})
    res.redirect("/art");
})

module.exports = router;