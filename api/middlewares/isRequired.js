const isRequired = (type, prop) => (req, res, next) => {
    const target = req[type][prop];
    if(target === null || target === undefined) {
        const err = new Error(`Wrong access! required ${type} : ${prop}`);
        err.status = 400;
        next(err);
    } else {
        next();
    }
};

module.exports = {isRequired};