const User = require("../models/userModel");
const AppError = require("../utils/AppErrors");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/tokenHandler");

// REGISTER
const addUserToDb = async (user) => {
  const existsEmail = await User.handle.findOne({ email: user.email });
  const existsUsername = await User.handle.findOne({ username: user.username });

  if (existsEmail || existsUsername) {
    const message = existsUsername
      ? "username is already in use"
      : "email is already in use";

    throw new AppError("INVALID_INFORMATION", message, 400);
  }

  const newUser = new User.handle(user);

  try {
    await newUser.save(); 
  } catch (error) {
    throw new AppError("DATABASE_ERROR", "Failed to save user", 500);
  }

  return newUser;
};

// LOGIN
const userCanLog = async (user) => {
  const exists = await User.handle.findOne(
    user.email ? { email: user.email } : { username: user.username }
  );

  if (!exists) {
    throw new AppError("INVALID_INFORMATION", "user not found", 404);
  }

  const isValid = await bcrypt.compare(user.password, exists.password);

  if (!isValid) {
    throw new AppError("INVALID_INFORMATION", "wrong email or password", 401);
  }

  return exists;
};

// RESET TOKEN
const genTokenReset = async (email) => {
  if (!email) throw new AppError("BODY_ERR", "missing informations", 400);

  const user = await User.handle.findOne({ email });

  if (!user) throw new AppError("USER_ERR", "user not found", 404);

  return generateToken(user, "reset_password");
};

// RESET PASSWORD
const resetPassword = async (userID, payload) => {
  const user = await User.handle.findById(userID);

  if (!user) throw new AppError("USER_ERROR", "user not found", 404);

  const samePassword = await bcrypt.compare(payload.newPassword, user.password);

  if (
    payload.newPassword !== payload.confirmPassword ||
    samePassword
  ) {
    throw new AppError(
      "CHANGE_PASSWORD_ERROR",
      payload.newPassword !== payload.confirmPassword
        ? "passwords do not match"
        : "new password must be different",
      400
    );
  }

  const hashed = await bcrypt.hash(payload.newPassword, 10);

  await User.handle.findByIdAndUpdate(userID, { password: hashed });

  return true;
};

module.exports = {
  addUserToDb,
  userCanLog,
  genTokenReset,
  resetPassword,
};