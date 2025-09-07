import express from 'express';
import passport from 'passport';
import { Login, Logout, Register, GoogleLogin } from '../controllers/authController.js';
const authRouter = express.Router();

authRouter.post('/register', Register);
authRouter.post('/login', Login);
authRouter.post('/logout', Logout);
authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
authRouter.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), (req, res) => { res.json({ success: true, user: req.user }); });
authRouter.post('/google', GoogleLogin);

export default authRouter;