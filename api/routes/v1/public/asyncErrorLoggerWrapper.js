const asyncErrorLoggerWrapper = (func, logger) => {
    return () => {
        func().catch(err => {
            logger.error(
                `status: ${err.status || err.code || 500}, message: ${err}\n`,
            );
        });
    };
};

module.exports = asyncErrorLoggerWrapper;
