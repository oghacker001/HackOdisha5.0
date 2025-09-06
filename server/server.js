import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import connectDB from './config/mongodb.js';
import { configurePassport } from './config/passport.js';
import authRouter from './routes/authRoute.js';
import "./config/passport.js";

const app= express();
const port= process.env.PORT || 4000;
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials:true //send cookies through res of express app
}));

configurePassport();
app.use(passport.initialize())

//API - ENDPOINTS
app.get('/',(req,res)=>{
    res.send("API IS WORKING");
})

app.use('/api/auth',authRouter); //It will work in /api/auth/register

app.listen(port, ()=>{
    console.log(`Server started on ${port}`);
});


