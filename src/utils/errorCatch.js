// here a is like an anlober of our functions and send the error into our error handler 
const errorCatch = (controller) => async (req , res , next ) => {
    try {
    	await controller( req , res ) 
    } catch (error) {
    	return next(error)
    }
}

module.exports= errorCatch
