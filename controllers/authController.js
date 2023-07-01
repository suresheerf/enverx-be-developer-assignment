const {
  JWT_EXPIRES_IN,
  JWT_COOKIE_EXPIRES_IN,
  JWT_SECRET,
} = require("../config/config");
const User = require("./../models/user.model");
const appError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const catchAsync = require("./../utils/catchAsync");

const signToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sercure: req.secure || req.headers["x-forwarded-proto"] === "https",
  };
  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    user,
  });
};

module.exports.signUp = catchAsync(async (req, res, next) => {
  console.log("body:", req.body);
  if (!req.body.name) {
    return next(new appError("Please pass nick name", 400));
  }
  if (!req.body.password) {
    return next(new appError("Please pass password", 400));
  }
  if (!req.body.email) {
    return next(new appError("Please pass email", 400));
  }
  if (!req.body.gender) {
    return next(new appError("Please pass gender", 400));
  }

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    gender: req.body.gender,
  });
  createSendToken(newUser, 201, req, res);
});

module.exports.login = catchAsync(async (req, res, next) => {
  console.log("body:", req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new appError("please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  console.log("user:", user);

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new appError("incorrect email or password", 401));
  }

  createSendToken(user, 200, req, res);
});
