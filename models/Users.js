import mongoose from 'mongoose';

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
    role : {
        type : String,
        required : true,
    },
});

const Users = mongoose.model("Users", UserSchema);


export default Users;
