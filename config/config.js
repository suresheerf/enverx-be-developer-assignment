require("dotenv").config();
const CONFIG = {};

CONFIG.NODE_ENV = process.env.NODE_ENV;
CONFIG.PORT = process.env.PORT || 3000;
CONFIG.DBURI = process.env.DBURI || "localhost:27019";

module.exports = CONFIG;
