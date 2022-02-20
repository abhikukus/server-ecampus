const express =  require("express")
const app = express()
const mongoose = require("mongoose")
const { Users } = require("./models/Users")
const cors = require("cors");
const cookieParser = require("cookie-parser")
const bcrypt = require("bcrypt")
const { createTokens, validateToken } = require("./JWT")

app.use(express.json()); 
app.use(cors());
app.use(cookieParser());

mongoose.connect("mongodb+srv://user123:Password123AbhiAmit@cluster0.v6vrw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")



app.post("/register",  (req, res) => {
    console.log("registering user...")
    const {username, password} = req.body;

    bcrypt.hash(password, 10).then( (hash) => {
        
        const newUser = new Users(
            {
                username : username,
                hash : hash
            }
        )
        newUser.save()
        .then(() => {
            res.json("User registered = " + username)
        })
        .catch((err) => {
            if(err) {
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
    const {username, password} = req.body;
    const user = await Users.findOne({ username: username});
    console.log(user)
    if(!user) {
        res.status(400).json({ error : "User doesn't exits" + username});
    }

    const dbPassword = user.hash;
    console.log(dbPassword)
    bcrypt.compare(password, dbPassword).then((match) => {
        console.log(match)
        if(!match){
            res
            .status(400)
            .json({ error : "Password WRONG!!!"})
        }else{

            const accessToken = createTokens(user);

            res.cookie("access-token", accessToken, {
                maxAge : 60*60*24*30*1000,
                httpOnly : true //for security - cookies wont be accessed by javascript code
            })

            res.json("LOGGED IN");
        }
    })

    
});

app.get("/profile", validateToken, (req, res) => {
    console.log("PROFILE")
    res.json("Profile")
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