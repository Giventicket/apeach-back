const createChunk = require('./createChunk');
const getChunk = require('./getChunk');
const updateChunk = require('./updateChunk');
const deleteChunk = require('./deleteChunk');
const parseForm = require('./parseForm');
const preprocess = require('./preprocess');
const uploadAudio = require('./uploadAudio');
const updateUserAfterCreateChunk = require('./updateUserAfterCreateChunk');
const updateUserAfterDeleteChunk = require('./updateUserAfterDeleteChunk');
const checkFile = require('./checkFile');

module.exports = {
    createChunk,
    getChunk,
    updateChunk,
    deleteChunk,
    parseForm,
    uploadAudio,
    preprocess,
    updateUserAfterCreateChunk,
    updateUserAfterDeleteChunk,
    checkFile,
};
