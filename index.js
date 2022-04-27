import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { createTokens, validateToken } from './JWT.js';
import loginRouter from './routes/loginRoutes.js';
import adminRouter from './routes/adminRoutes.js';


dotenv.config();
const app = express();
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.REACT_APP_MONGODB_URL)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((err) => {
    console.log(err.message);
  });


app.use('/api/admin', adminRouter);
app.use('/api/login', loginRouter);

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

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log("SERVER RUN PERFECTLY!");
    console.log(`server at http://localhost:${port}`);
})