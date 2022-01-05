const {Storage} = require('@google-cloud/storage');
const storage = new Storage({ keyFilename: process.env.KEY_FILENAME });

module.exports = (app) => {
    app.use((req, res, next) => {
        req.gcStorage = storage;
        next();
    });
};