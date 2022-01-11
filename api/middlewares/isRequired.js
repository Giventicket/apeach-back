const isRequired = (type, prop, required) => (req, res, next) => {
    const target = req[type][prop];
    if ((target === null || target === undefined) === required) {
        const err = new Error(`Wrong access! ${required ? "required" : "not required"} ${type} : ${prop}`);
        err.status = 400;
        next(err);
    } else {
        next();
    }
};

module.exports = { isRequired };