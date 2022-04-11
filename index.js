const express =  require("express")
const app = express()
const mongoose = require("mongoose")
const { Users } = require("./models/Users")
const cookieParser = require("cookie-parser")
const bcrypt = require("bcrypt")
const { createTokens, validateToken } = require("./JWT")
require('dotenv').config()

const cors = require('cors');
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.REACT_APP_MONGODB_URL)

app.post("/register",  (req, res) => {
    console.log("registering user...")
    const {username, password, role} = req.body;

    bcrypt.hash(password, 10).then( (hash) => {
        
        const newUser = new Users(
            {
                username : username,
                hash : hash,
                role : role
            }
        )
        newUser.save()
        .then(() => {
            res.json("User registered = " + username)
        })
        .catch((err) => {
            
            if(err) {
                if(err.code == 11000) {
                    console.log("User already Exits!")
                }
                res.status(400).json({ error : err})
            }
        })
    })

    //const newUser = new UserModel(user);
    //await newUser.save();
    //console.log(password)
    //res.json(password);
    
});

app.post("/login", async (req, res) => {
    console.log(req.body);
    const {username, password} = req.body;
    if(username == "" || password == "") {
        res.status(400).json({ error : "Missing username or password " + username});
    }
    const user = await Users.findOne({ username: username});
    console.log(user)
    if(!user) {
        res.status(402).json({ error : "User doesn't exits in database " + username});
    }

    const dbPassword = user.hash;
    console.log(dbPassword)
    bcrypt.compare(password, dbPassword).then((match) => {
        console.log(match)
        if(!match){
            res
            .status(403)
            .json({ error : "Password WRONG!!!"})
        }else{

            const accessToken = createTokens(user);

            res.cookie("access-token", accessToken, {
                maxAge : 60*60*24*30*1000,
                httpOnly : true //for security - cookies wont be accessed by javascript code
            })
            
            console.log(user.role)
            res
            .status(200)
            .json({
                status : "LOGGED IN",
                user : user.username,
                role : user.role,
                accessToken : accessToken
            });
        }
    })

    
});

app.get("/profile", validateToken, (req, res) => {
    console.log("PROFILE")
    
    res.json({ 
        authStatus : req.authenticated,
        username : req.username,
        role : req.role 
    })
}); 

app.get("/test", (req, res) => {
    console.log("API GET WORKING")
    res.json("API WORKING")

    /*
    Users.find({}, (err, result) => {
        if(err){
            res.json(err);
        }else{
            res.json(result);
        }
    });
    */
});

app.listen(3001, () => {
    console.log("SERVER RUN PERFECTLY!")
})