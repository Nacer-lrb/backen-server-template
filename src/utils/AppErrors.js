// we create a class wich is an instance of Error classes to create custom errors
class AppError extends Error {
    constructor( errorCode , message , statusCode ) {
	super(message)
	this.errorCode = errorCode 
	this.statusCode = statusCode
    }
}

module.exports = AppError
