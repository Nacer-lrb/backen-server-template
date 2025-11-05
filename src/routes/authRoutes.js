const router = require("express").Router()
const authControllers = require("../controllers/authControllers")
const isAuth = require("../middlewares/isAuthMiddlware")
const errorCatch = require("../utils/errorCatch")


router.post("/register", errorCatch(authControllers.createNewUser) )
// router.post("/request-email",errorCatch(authControllers.requestEmail) )
// router.post("/verify-email-otp",errorCatch(authControllers.verifyEmail) )
router.post("/login" , errorCatch(authControllers.loginUser))
router.post("/refreshToken" , errorCatch(authControllers.tokenRefresher))
router.get("/me" , isAuth , errorCatch(authControllers.getUserInfo))
// router.post("/change-password" , isAuth , errorCatch(authControllers.changePassword))
// router.post("/forgot-password" , errorCatch(authControllers.forgotPassword))
// router.post("/verify-reset-otp",errorCatch(authControllers.verifyResetOtp))
// router.post("/reset-password",isAuth,errorCatch(authControllers.resetPassword))
router.post("/edit-profile",isAuth,errorCatch(authControllers.editProfile))



module.exports = router
