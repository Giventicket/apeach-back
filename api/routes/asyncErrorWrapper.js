const asyncErrorWrapper = (func) => {
    return (req, res, next) => {
      func(req, res, next).catch(next);
    };
}

module.exports = asyncErrorWrapper
