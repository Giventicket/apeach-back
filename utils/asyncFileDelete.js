const asyncErrorLoggerWrapper = require('./asyncErrorLoggerWrapper');
const fs = require('fs').promises;

const asyncFileDelete = filepath => {
    asyncErrorLoggerWrapper(async () => {
        await fs.unlink(filepath);
    })();
};

module.exports = asyncFileDelete;
