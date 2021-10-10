const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const User = require("../model/model");

const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;

// passport.use(
//   "signup",
//   new localStrategy(
//     {
//       usernameField: "email",
//       passwordField: "password",
//     },
//     async (email, password, done) => {
//       try {
//         const user = await UserModel.create({ email, password });

//         return done(null, user);
//       } catch (error) {
//         done(error);
//       }
//     }
//   )
// );

passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    function (req, email, password, done) {
      findOrCreateUser = function () {
        // find a user in Mongo with provided username
        console.log(req.body);
        User.findOne({ email: email }, function (err, user) {
          // In case of any error return
          if (err) {
            console.log("Error in Signup: " + err);
            return done(err);
          }
          // already exists
          if (user) {
            console.log("User already exists");
            return done(
              null,
              false,
              req.flash("message", "User Already Exists")
            );
          } else {
            // if there is no user with that email
            // create the user
            var newUser = new User();
            // set the user's local credentials
            newUser.name = req.body.name;
            newUser.email = email;
            newUser.role = req.body.role;
            newUser.password = password;
            // save the user
            newUser.save(function (err) {
              if (err) {
                console.log("Error in Saving user: " + err);
                throw err;
              }
              console.log("User Registration succesful");
              return done(null, newUser);
            });
          }
        });
      };
      // Delay the execution of findOrCreateUser and execute
      // the method in the next tick of the event loop
      process.nextTick(findOrCreateUser);
    }
  )
);

passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        const validate = await user.isValidPassword(password);

        if (!validate) {
          return done(null, false, { message: "Wrong Password" });
        }

        return done(null, user, { message: "Logged in Successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new JWTstrategy(
    {
      secretOrKey: "TOP_SECRET",
      jwtFromRequest: ExtractJWT.fromUrlQueryParameter("secret_token"),
    },
    async (token, done) => {
      console.log(token);
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);
