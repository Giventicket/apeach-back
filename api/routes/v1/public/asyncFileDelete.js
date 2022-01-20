const asyncErrorLoggerWrapper = require('./asyncErrorLoggerWrapper');
const fs = require('fs').promises;

const asyncFileDelete = (filepath, logger) => {
    asyncErrorLoggerWrapper(async () => {
        await fs.unlink(filepath);
    }, logger)();
};

module.exports = asyncFileDelete;
