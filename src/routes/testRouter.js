// routes/testRoutes.js
const router = require("express").Router()
const mongoose = require("mongoose")

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
    const v = obj.something
    res.json({ v }) 
  })
)


router.get(
  "/test-crash-db",
  catchAsync(async (req, res) => {
    
    await mongoose.model("User").findById("invalid_object_id_123")
    res.json({ ok: true }) 
  })
)

module.exports = router
