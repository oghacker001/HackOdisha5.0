import express from 'express';
import session from 'express-session';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import connectDB from './config/mongodb.js';
import { configurePassport } from './config/passport.js';
import authRouter from './routes/authRoute.js';
import userRouter from './routes/userRoute.js'
import donationRouter from './routes/donationRoute.js'
import "./config/passport.js";
import campaignRouter from './routes/campaignRoute.js'
const app= express();
const port= process.env.PORT || 4000;
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials:true //send cookies through res of express app
}));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "keyboard cat", // keep this in .env for production
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // set secure: true if using HTTPS
  })
);

configurePassport();
app.use(passport.initialize())
// app.use(passport.session());
//API - ENDPOINTS
app.get('/',(req,res)=>{
    res.send("API IS WORKING");
})

app.use('/api/auth',authRouter); //It will work in /api/auth/register
app.use('/api/campaign',campaignRouter);
app.use('/api/users',userRouter);
app.use("/api/donations", donationRouter);
app.listen(port, ()=>{
    console.log(`Server started on ${port}`);
});


