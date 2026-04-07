const User = require("../models/userModel");
const AppError = require("../utils/AppErrors");
const bcrypt = require("bcrypt");
const validateReq = require("../utils/validateReq");

// GET USER
const getUserInfo = async (userID) => {
  const user = await User.handle.findById(userID);

  if (!user) throw new AppError("USER_ERROR", "user not found", 404);

  const { password, ...userWithoutPassword } = user.toObject();
  return userWithoutPassword;
};
// CHANGE PASSWORD (logged user)
const verifyPassAndEdit = async (userID, payload) => {
  const user = await User.handle.findById(userID);

  if (!user) throw new AppError("USER_ERROR", "user not found", 404);

  const isValid = await bcrypt.compare(payload.oldPassword, user.password);

  if (!isValid) {
    throw new AppError("CHANGE_PASSWORD_ERROR", "incorrect password", 400);
  }

  validateReq(User.passwordSchema, payload.newPassword);

  if (
    payload.newPassword !== payload.confirmPassword ||
    payload.oldPassword === payload.newPassword
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

// UPDATE PROFILE
const editProfile = async (userID, informations) => {
  const allowedKeys = [
    "firstname",
    "lastname",
    "gender",
    "phoneNumber",
    "civility",
    "birthdate",
    "address",
    "country",
    "town",
    "postalCode",
  ];

  Object.keys(informations).forEach((key) => {
    if (!allowedKeys.includes(key) || !informations[key]) {
      delete informations[key];
    }
  });

  if (Object.keys(informations).length === 0) {
    throw new AppError(
      "INVALID_INFORMATION",
      "no valid fields to update",
      400
    );
  }

  validateReq(User.schemaUpdateRef, informations);

  const updated = await User.handle.findByIdAndUpdate(userID, informations);

  if (!updated) {
    throw new AppError("INTERNAL_ERROR", "update failed", 500);
  }

  return true;
};

module.exports = {
  getUserInfo,
  verifyPassAndEdit,
  editProfile,
};