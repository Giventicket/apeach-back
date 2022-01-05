const isRequired = (type, prop) => (req, res, next) => {
    const target = req[type][prop];
    if(target === null || target === undefined) {
        res.status(400).json({ 
            message: `Wrong access! required ${type} : ${prop}`, 
            data: { }
        });
        next();
    } else {
        console.log(error);
        next(error);
    }
};

module.exports = {isRequired};