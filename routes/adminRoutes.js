import express from 'express';
import mongoose from 'mongoose';
import Users from '../models/Users.js';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcrypt';
import { createTokens, validateToken } from '../JWT.js';

const adminRouter = express.Router();

adminRouter.post("/register",  (req, res) => {
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
    
});

export default adminRouter;