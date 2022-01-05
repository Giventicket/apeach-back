const isRequired = (type, prop) => (req, res, next) => {
    const target = req[type][prop];
    if(target === null || target === undefined) {
        res.status(400).json({ 
            message: `Wrong access! required ${type} : ${prop}`, 
            data: { }
        });
    } else {
        next();
    }
};

module.exports = {isRequired};