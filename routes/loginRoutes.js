import express from 'express';
import mongoose from 'mongoose';
import Users from '../models/Users.js';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcrypt';
import { createTokens, validateToken } from '../JWT.js';

const loginRouter = express.Router();

loginRouter.post("/", async (req, res) => {
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

export default loginRouter;