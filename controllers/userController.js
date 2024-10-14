const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/customError");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.signup = BigPromise(async (req, res, next) => {
  const { fullname, mobile, email, password } = req.body;

  if (!(fullname && mobile && password)) {
    return res.status(200).json(CustomError("All fields required", 400));
  }

  const existingUser = await User.findOne({ mobile });
  if (existingUser) {
    return res.status(200).json(CustomError("User Already Exist", 400));
  }

  const myEncPassword = await bcrypt.hash(password, 10);

  const userCreate = await User.create({
    fullname,
    mobile,
    email: email ? email.toLowerCase() : "",
    password: myEncPassword,
    totalScore: 0,
    totalEarning: 0,
  });
  const token = userCreate.getJwtToken();
  userCreate.password = undefined;

  return res.status(200).json({
    success: "true",
    message: "User created successfully",
    userCreate,
    token,
  });
});

exports.login = BigPromise(async (req, res, next) => {
  const { mobile, password } = req.body;

  if (!(mobile && password)) {
    return res.status(200).json(CustomError("All fields required", 400));
  }
  const user = await User.findOne({ mobile }).select("+password");
  if (!user) {
    return res.status(200).json(CustomError("No User Found", 400));
  }

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = user.getJwtToken();
    user.password = undefined;
    // res.status(200).json(user);

    return res.status(200).json({
      success: "true",
      message: "User Logged in successfully",
      user,
      token,
    });
  }
  return res.status(200).json(CustomError("Incorrect email or password", 400));
});

exports.userDetails = BigPromise(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});
exports.allUsers = BigPromise(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});
