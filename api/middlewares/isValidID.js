const mongoose = require('mongoose');

const isValidID = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        const err = new Error(`Wrong ID format! ${req.params.id}`);
        err.status = 400;
        next(err);
    } else {
        next();
    }
};

module.exports = {isValidID};