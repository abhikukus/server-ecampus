const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    
    username : {
        type : String,
        required : true,
        unique : true
    },
    hash : {
        type : String,
        required : true,
    },
});

const Users = mongoose.model("UserAuthentication", UserSchema);

module.exports = { Users };