const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, "Please provide a name"],
    trim: true,
    minlength: [2, "Name should have at least 2 characters"],
    maxlength: [40, "Name should be under 40 characters"],
    match: [
      /^[a-zA-Z\s'-]+$/,
      "Name should contain only letters, spaces, hyphens, and apostrophes",
    ],
  },
  mobile: {
    type: String,
    required: [true, "Please add phone number"],
    validate: [validator.isMobilePhone, "Please enter a valid Mobile Number"],
    unique: true,
  },
  email: {
    type: String,
    validate: [validator.isEmail, "Plese enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    select: false,
  },
  totalscore: {
    type: Number,
    default: 0,
    min: [0, "Score cannot be negative"],
  },
  totalEarning: {
    type: Number,
    default: 0,
    min: [0, "Earnings cannot be negative"],
  },
  withdrawHistory: {
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastUpdatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.methods.isPasswordValidated = async function (userPassword) {
  return await bcrypt.compare(this.password, userPassword);
};

userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

module.exports = mongoose.model("User", userSchema);
