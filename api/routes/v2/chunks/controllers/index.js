const createChunk = require('./createChunk');
const getChunk = require('./getChunk');
const updateChunk = require('./updateChunk');
const deleteChunk = require('./deleteChunk');
const preprocess = require('./preprocess');
const uploadAudio = require('./uploadAudio');
const updateUserAfterCreateChunk = require('./updateUserAfterCreateChunk');
const updateUserAfterDeleteChunk = require('./updateUserAfterDeleteChunk');
const checkFile = require('./checkFile');
const parseFile = require('./parseFile');

module.exports = {
    createChunk,
    getChunk,
    updateChunk,
    deleteChunk,
    uploadAudio,
    preprocess,
    updateUserAfterCreateChunk,
    updateUserAfterDeleteChunk,
    checkFile,
    parseFile,
};
