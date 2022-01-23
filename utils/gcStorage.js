const { Storage } = require('@google-cloud/storage');
const gcStorage = new Storage({ keyFilename: process.env.KEY_FILENAME });

module.exports = gcStorage;
