require("dotenv").config();
const CONFIG = {};

CONFIG.NODE_ENV = process.env.NODE_ENV;
CONFIG.PORT = process.env.PORT || 3000;
CONFIG.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
CONFIG.JWT_COOKIE_EXPIRES_IN = process.env.JWT_COOKIE_EXPIRES_IN;
CONFIG.JWT_SECRET = process.env.JWT_SECRET;
CONFIG.HOST = process.env.HOST;
CONFIG.DBURI = process.env.DBURI || "mongodb://127.0.0.1:27017";

module.exports = CONFIG;
