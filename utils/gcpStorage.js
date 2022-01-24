const { Storage } = require('@google-cloud/storage');
const gcpStorage = new Storage({ keyFilename: process.env.KEY_FILENAME });

module.exports = gcpStorage;
