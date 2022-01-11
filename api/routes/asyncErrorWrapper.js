const asyncErrorWrapper = (func) => {
    return async (req, res, next) => {
      await func(req, res, next).catch(next);
    };
}

module.exports = { asyncErrorWrapper }
