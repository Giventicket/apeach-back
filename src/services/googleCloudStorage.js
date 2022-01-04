const {Storage} = require('@google-cloud/storage');
const storage = new Storage({ keyFilename: process.env.KEY_FILENAME });

module.exports = storage;