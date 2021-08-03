const { Schema, model } = require("mongoose");
const { genSalt, hash, compare } = require("bcryptjs");
const { randomBytes, createHash } = require("crypto");
const { sign } = require("jsonwebtoken");
const Recipe = require("./Recipe.model.js");

const UserSchema = new Schema({
  fullName: String,
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  selectedAvatar: String,
  recipes: [Recipe.schema],
  likes: [Recipe.schema],
  following: [{ username: String, selectedAvatar: String }],
  followers: [{ username: String, selectedAvatar: String }],
  notifications: {
    type: [
      {
        username: String,
        selectedAvatar: String,
        notificationType: String,
        recipeTitle: String,
      },
    ],
    default: [],
  },
  date: { type: Date, default: Date.now },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (password) {
  return await compare(password, this.password);
};

UserSchema.methods.getSignedJwtToken = function () {
  return sign(
    {
      _id: this._id,
      fullName: this.fullName,
      username: this.username,
      email: this.email,
      selectedAvatar: this.selectedAvatar,
      date: this.date,
      notifications: this.notifications,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = randomBytes(20).toString("hex");
  // Hash token (private key) and save to database
  this.resetPasswordToken = createHash("sha256")
    .update(resetToken)
    .digest("hex");
  // Set token expire date
  this.resetPasswordExpire = Date.now() + 10 * (60 * 1000); // Ten Minutes
  return resetToken;
};

module.exports = User = model("Users", UserSchema);
