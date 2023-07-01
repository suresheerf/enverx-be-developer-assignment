require("dotenv").config();
const CONFIG = {};

CONFIG.NODE_ENV = process.env.NODE_ENV;
CONFIG.PORT = process.env.PORT || 3000;

module.exports = CONFIG;
