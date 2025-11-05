// routes/testRoutes.js
const router = require("express").Router()
const mongoose = require("mongoose")

// Utilitaire pour attraper les erreurs async (si tu n'as pas errorCatch)
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}


router.get("/greeting", (req, res) => {
  res.status(200).json({ greeting: "hello world" })
})

router.get("/test-crash-sync", (req, res) => {
  const obj = undefined
  const v = obj.key 
  res.json({ v })     
})


router.get(
  "/test-crash-async",
  catchAsync(async (req, res) => {
    const obj = undefined
    // provoque une erreur dans le contexte async
    const v = obj.something
    res.json({ v }) 
  })
)


router.get(
  "/test-crash-db",
  catchAsync(async (req, res) => {
    
    await mongoose.model("User").findById("invalid_object_id_123")
    res.json({ ok: true }) // jamais atteint si erreur
  })
)

module.exports = router
