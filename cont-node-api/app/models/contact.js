var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ContactSchema = new Schema({
    name: String,
    email: String,
    phone: String,
    message: String
});

module.exports = mongoose.model('Contact', ContactSchema);