const authServices = require("../services/authServices");
const User = require("../models/userModel");
const getReq = require("../utils/getReq");
const { generateToken, generateRefreshToken, validateToken } = require("../utils/tokenHandler");
const AppError = require("../utils/AppErrors");
const validateReq = require("../utils/validateReq");

// REGISTER
const register = async (req, res) => {
  validateReq(User.schemaJoiRef, req.body);
  const newUser = getReq(req.body);
  const result = await authServices.addUserToDb(newUser);

  res.status(201).json({
    status: "success",
    data: result,
  });
};

// LOGIN
const login = async (req, res) => {
  const userToLogin = getReq(req.body);
  const user = await authServices.userCanLog(userToLogin);

  const accessToken = generateToken(user);
  const refreshToken = generateRefreshToken(user);

  const { password, ...userData } = user.toObject();
  res.status(200).json({
    status: "success",
    accessToken,
    refreshToken,
    data: userData,
  });
};

// REFRESH TOKEN
const refreshToken = async (req, res) => {
  const token = req.body.refreshToken;

  if (!token) {
    throw new AppError(
      "INVALID_REFRESH_TOKEN",
      "No refresh token provided",
      400
    );
  }
  const decoded = validateToken(token, "refreshToken");
  const newAccessToken = generateToken(decoded);

  res.status(200).json({
    status: "success",
    accessToken: newAccessToken,
  });
};


// EMAIL VERIFICATION
const requestEmail = async (req, res) => {
  const { email } = req.body;
  await authServices.sendOtpEmail(email, "email verification", req);

  res.status(200).json({
    status: "success",
    message: `check your email ${email}`,
  });
};

const verifyEmail = async (req, res) => {
  const payload = req.body;
  const verified = await authServices.verifyEmailPayload(payload, "email verification");

  if (!verified) {
    throw new AppError("INTERNAL_ERROR_OTP", "une erreur s est produite", 500);
  }

  res.status(200).json({
    status: "success",
    message: "email verified successfully",
  });
};

// PASSWORD RESET FLOW
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  await authServices.sendOtpEmail(email, "reset password", req);

  res.status(200).json({
    status: "success",
    message: `check your email ${email}`,
  });
};

const verifyResetOtp = async (req, res) => {
  const payload = req.body;
  const verified = await authServices.verifyEmailPayload(payload, "reset password");

  if (!verified) {
    throw new AppError("INTERNAL_ERROR_OTP", "une erreur s est produite", 500);
  }

  const token = await authServices.genTokenReset(payload.email);

  res.status(200).json({
    status: "success",
    message: "use this token for reset the password",
    tokenReset: token,
  });
};

const resetPassword = async (req, res) => {
  if (!req.user.scope || req.user.scope !== "reset_password") {
    throw new AppError("UNAUTHORIZED", "unauthorized to reset password", 401);
  }

  const userID = req.user.id;
  const payload = req.body;

  await authServices.resetPassword(userID, payload);

  res.status(200).json({
    status: "success",
    message: "password changed successfully",
  });
};

module.exports = {
  register,
  login,
  refreshToken,
  requestEmail,
  verifyEmail,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
};