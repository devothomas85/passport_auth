const express = require("express");
const router = express.Router();

//middleware - login

const verifyRole = (req, res, next) => {
  if (req.session.user.role == "admin") {
    next();
  } else {
    res.json({ message: "You can't create user" });
  }
};

router.get("/profile", verifyRole, (req, res, next) => {
  res.json({
    message: "You made it to the secure route",
    user: req.session.user,
    //token: req.query.secret_token,
  });
});

module.exports = router;
