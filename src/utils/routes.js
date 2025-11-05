const express = require("express")
const cors = require("cors")
const errorHandeler = require("../middlewares/errorHandler")
const authRoutes = require("../routes/authRoutes")
const isAuth = require("../middlewares/isAuthMiddlware")
const testRouter = require("../routes/testRouter")


module.exports = (app) => {
    // routes prefix  

    app.use(cors())
    app.use(express.json())

    app.use("/api/v1/auth", authRoutes )
    //test 
    app.use("/api/v1/test"  , testRouter)
    // add here your routes



    // end routes 

    // keep the error handler at the end like that  
    app.use(errorHandeler)
}
