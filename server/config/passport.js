// config/passport.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/userModels.js";

export const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            user = await User.create({
              googleId: profile.id,
              displayName: profile.displayName,
              firstName: profile.name?.givenName || "",
              lastName: profile.name?.familyName || "",
              email: profile.emails?.[0]?.value || null,
              image: profile.photos?.[0]?.value || null,
              role: "user", // default role (can override later)
            });
          }

          return done(null, user); // just user, no token
        } catch (err) {
          console.error("GoogleStrategy error:", err.message);
          return done(err, null);
        }
      }
    )
  );
};
