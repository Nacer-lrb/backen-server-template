// here we hundel errors and send a response if an error was occured
const AppError = require("../utils/AppErrors")

const errorHandeler = (error , req , res , next ) => {
    if ( error instanceof AppError ){
	return res.status(error.statusCode).json({
	    success: false ,
	    message: error.message , 
	    errorCode: error.errorCode 
	})
    }
	const isDev = process.env.NODE_ENV === "development";

	if (isDev) {
	  return res.status(500).json({
		success: false,
		message: error.message || "Unknown server error",
		errorCode: error.name || "SERVER_ERROR",
		stack: error.stack || null, // utile pour le debug
	  });
	}
  
	return res.status(500).json({
	  success: false,
	  message: "Internal server error. Please try again later.",
	  errorCode: "SERVER_ERROR",
	});
  };
  
	
	module.exports = errorHandeler