const { Storage } = require('@google-cloud/storage');
const gcStorage = new Storage({ keyFilename: process.env.KEY_FILENAME });

module.exports = app => {
    app.set('gcStorage', gcStorage);
    app.use((req, res, next) => {
        req.gcStorage = gcStorage;
        next();
    });
};
