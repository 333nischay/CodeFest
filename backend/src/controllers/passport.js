import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import {User} from '../models/user.model.js';

const PassportConfig = (passport) => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.BACKEND_URL+"/api/v1/users/google/callback"
      },
      async function(accessToken, refreshToken, profile, cb) {
        try {
          // Find or create the user in the database
          const email = profile.emails[0].value ;
          let user = await User.findOne({ email});
          if (!user) {
            user = await User.create({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
              isVerified: true,
            });
            await user.save();
          }
          else{
            if(user.googleId){
                if(user.googleId == profile.id){
                    return cb(null,user);
                }
                else{
                    return cb(null,false);
                }
            }
            else{
                user.isVerified = true;
                user.googleId = profile.id;
                await user.save();
            }
          }
          return cb(null, user);
        } catch (err) {
          return cb(err, null);
        }
      }
    ));

}
export default PassportConfig;