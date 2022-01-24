const logger = require('./logger');

const asyncErrorLoggerWrapper = func => {
    return async () => {
        await func().catch(err => {
            logger.error(
                `status: ${err.status || err.code || 500}, message: ${err}\n`,
            );
        });
    };
};

module.exports = asyncErrorLoggerWrapper;
