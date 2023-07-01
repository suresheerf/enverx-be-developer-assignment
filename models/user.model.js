const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, require: [true, "Please pass name"] },
    email: { type: String, require: [true, "Please pass email"] },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      require: [true, "Please pass gender"],
    },
    password: { type: String, require: [true, "Please pass password"] },
  },
  { timestamps: true }
);
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;
  next();
});
UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
const User = mongoose.model("User", UserSchema);

module.exports = User;
