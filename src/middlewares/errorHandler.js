const AppError = require("../utils/AppErrors");
/**
 * Middleware global de gestion des erreurs Express
 */
const errorHandler = (err, req, res, next) => {
  // erreur custom
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errorCode: err.errorCode,
    });
  }

  const isDev = process.env.NODE_ENV === "development";

  // erreur inconnue / non-operational
  if (isDev) {
    return res.status(500).json({
      success: false,
      message: err.message || "Unknown server error",
      errorCode: err.name || "SERVER_ERROR",
      stack: err.stack || null,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error. Please try again later.",
    errorCode: "SERVER_ERROR",
  });
};

module.exports = errorHandler;