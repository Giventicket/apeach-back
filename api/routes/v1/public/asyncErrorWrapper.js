const asyncErrorWrapper = (func) => {
    return (req, res, next) => {
      setImmediate(() => func(req, res, next).catch(next));
    };
}

module.exports = asyncErrorWrapper