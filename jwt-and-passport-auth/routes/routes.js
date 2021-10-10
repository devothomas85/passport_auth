const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post(
  "/signup",
  passport.authenticate("signup", { session: false }),
  async (req, res, next) => {
    res.json({
      message: "Signup successful",
      user: req.user,
    });
  }
);

router.post("/login", async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        const error = new Error("An error occurred.");

        return next(error);
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        req.session.loggedIn = true;
        req.session.user = {
          _id: user._id,
          email: user.email,
          role: user.role,
        };
        //const body = { _id: user._id, email: user.email, role: user.role };
        //const token = jwt.sign({ user: body }, "TOP_SECRET");

        //return res.json({ token });
        return res.json(req.session);
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  try {
    req.session.destroy();
    res.json({ message: "You are logout completly" });
  } catch {
    res.json({ message: "You cant logout now" });
  }

  res.redirect("/");
});

module.exports = router;
