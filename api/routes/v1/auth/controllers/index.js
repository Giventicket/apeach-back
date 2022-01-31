const login = require('./login');
const signin = require('./signin');
const signout = require('./signout');
const addChunk = require('../../auth/controllers/addChunk');
const makeSamples = require('../../auth/controllers/makeSamples');
const removeChunk = require('../../auth/controllers/removeChunk');
const updateSample = require('../../auth/controllers/updateSample');
const uploadFile = require('../../auth/controllers/uploadFile');

module.exports = {
    login,
    signin,
    signout,
    addChunk,
    makeSamples,
    removeChunk,
    updateSample,
    uploadFile,
};
