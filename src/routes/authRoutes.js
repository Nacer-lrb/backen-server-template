const router = require("express").Router();
const authControllers = require("../controllers/authControllers");
const errorCatch = require("../utils/errorCatch");

// AUTH ONLY
router.post("/register", errorCatch(authControllers.register));
router.post("/login", errorCatch(authControllers.login));
router.post("/refresh-token", errorCatch(authControllers.refreshToken));

module.exports = router;