import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/userModels.js';
import { generateToken } from '../utils/token.js';

export const configurePassport = () => {
  passport.use(
    new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails?.[0]?.value || null,
          role: 'user',
        };
        let user = await User.findOne({ googleId: profile.id });
        if (!user && newUser.email) { user = await User.findOne({ email: newUser.email }); }
        if (!user) { user = await User.create(newUser); }
        const token = generateToken(user._id, user.role);
        done(null, { user, token });
      } catch (err) {
        console.error("GoogleStrategy error:", err.message);
        done(err, null);
      }
    })
  );

  // FIXED: Added missing serialization/deserialization
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};