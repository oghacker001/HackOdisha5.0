
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/userModels.js';
import { generateToken} from '../utils/token.js';
export const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name?.givenName || "",
            lastName: profile.name?.familyName || "",
            email: profile.emails?.[0]?.value || null,
            image: profile.photos?.[0]?.value || null,
          };

          // Try finding user by googleId or email
          let user = await User.findOne({ googleId: profile.id });
          if (!user && newUser.email) {
            user = await User.findOne({ email: newUser.email });
          }

          if (!user) {
            user = await User.create(newUser);
          }

          // Generate JWT
          const token = generateToken(user._id);

          done(null, { user, token });
        } catch (err) {
          console.error("GoogleStrategy error:", err.message);
          done(err, null);
        }
      }
    )
  );
};
