const router = require("express").Router();
const userControllers = require("../controllers/userControllers");
const isAuth = require("../middlewares/isAuthMiddlware");
const errorCatch = require("../utils/errorCatch");

// USER 
router.get("/me", isAuth, errorCatch(userControllers.getMe));
router.patch("/me", isAuth, errorCatch(userControllers.updateProfile));
router.patch("/change-password", isAuth, errorCatch(userControllers.changePassword)); 
module.exports = router;