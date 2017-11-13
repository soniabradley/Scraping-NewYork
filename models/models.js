// Require mongoose
var mongoose = require("mongoose");
// Get a reference to the mongoose Schema constructor
var Schema = mongoose.Schema;

var ContentSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    url: {
        type: String,
        require: true
        
    },
    note: {
        type: String,
        require: true,
        trim: true,
        default: "default note"
    },
    saved: {
        type: Boolean,
        required: true,
        default: false
    }
});
    
// This creates our model from the above schema, using mongoose's model method
var Content = mongoose.model("redditcontent", ContentSchema);

module.exports = Content;