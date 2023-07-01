const crypto = require("crypto");
const { promisify } = require("util");
const User = require("./../models/user.model");
const appError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const catchAsync = require("./../utils/catchAsync");

module.exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new appError("you are not logged in! please login to get access", 401)
    );
  }

  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const user = await User.findOne({ _id: decode.id });

  if (!user) return next(new appError("User not found", 404));

  req.user = user;
  res.locals.user = user;
  next();
});
