const appError = require("./../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new appError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new appError(message, 400);
};

const handleJsonWebTokenError = () =>
  new appError("invalid token! please login agin", 401);

const handleJWTExpiredError = () =>
  new appError("token expired! please login again", 401);

const sendErrorDev = (err, req, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, req, res) => {
  console.log("api:", req.originalUrl);

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      title: "somthing went wrong",
      message: err.message,
    });
  }
  console.log("Error:", err);
  return res.status(err.statusCode).json({
    title: "somthing went wrong",
    message: "Something went wrong,try again after some time.",
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    console.log("err:", err);
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJsonWebTokenError();
    if (error.name === "JWTExpiredError") error = handleJWTExpiredError();
    sendErrorProd(error, req, res);
  }
};
