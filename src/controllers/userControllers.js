const userServices = require("../services/userServices");
const getReq = require("../utils/getReq");
const AppError = require("../utils/AppErrors");

// GET PROFILE (current logged user)
const getMe = async (req, res) => {
  const userID = req.user.id;

  const userInfo = await userServices.getUserInfo(userID);

  res.status(200).json({
    status: "success",
    data: userInfo,
  });
};

// CHANGE PASSWORD (connected user)
const changePassword = async (req, res) => {
  const userID = req.user.id;
  const payload = req.body;

  // appelle le service qui gère toute la logique
  await userServices.verifyPassAndEdit(userID, payload);

  res.status(200).json({
    status: "success",
    message: "Password changed successfully",
  });
};

// UPDATE PROFILE
const updateProfile = async (req, res) => {
  const userID = req.user.id;
  const body = getReq(req.body);

  const success = await userServices.editProfile(userID, body); // <-- changement ici

  if (!success) {
    throw new AppError("INTERNAL_ERROR", "Problem occurred updating profile", 500);
  }

  res.status(200).json({
    status: "success",
    message: "Information updated successfully",
  });
};

module.exports = {
  getMe,
  changePassword,
  updateProfile,
};