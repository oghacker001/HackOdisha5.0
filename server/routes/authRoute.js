import express from 'express';
import { Login, Logout, Register } from '../controllers/authController.js';
import passport from 'passport';
const authRouter= express.Router(); //Created a new router


//API - ENDPOINTS
authRouter.post('/register',Register);
authRouter.post('/login',Login);
authRouter.post('/logout',Logout);

authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
authRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    console.log("Google login success:", req.user);

    res.json({
      success: true,
      message: "Google Authentication Successful",
      user: req.user,
    });
  }
);

export default authRouter;