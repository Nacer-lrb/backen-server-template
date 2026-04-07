/**
 * Wrapper pour gérer les erreurs async dans les controllers
 * @param {Function} controller - Controller Express async
 */
const errorCatch = (controller) => async (req, res, next) => {
  try {
    await controller(req, res, next);
  } catch (error) {
    next(error);
  }
};

module.exports = errorCatch;