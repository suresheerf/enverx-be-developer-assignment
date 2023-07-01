const { PORT, DBURI } = require("./config/config");
const mongoose = require("mongoose");
const app = require("./app");

const server = app.listen(PORT, "0.0.0.0", (err) => {
  if (!err) {
    console.log(`server listening on port ${PORT}`);
  }
});
mongoose
  .connect(DBURI)
  .then(async () => {
    console.log("DB connection succesfull");
  })
  .catch((err) => {
    console.log("Error:", err);
  });
process.on("unhandledRejection", () => {
  console.log("unhandledRejection");
});
