class AppError extends Error {
  /**
   * @param {string} errorCode - Code interne de l'erreur
   * @param {string} message - Message d'erreur à renvoyer
   * @param {number} statusCode - HTTP status code
   */
  constructor(errorCode, message, statusCode) {
    super(message);
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.isOperational = true; 
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;