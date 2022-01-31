const login = require('./login');
const signin = require('./signin');
const signout = require('./signout');
const addChunk = require('../../auth/controllers/addChunk');
const removeChunk = require('../../auth/controllers/removeChunk');
const updateSample = require('./addSample');
const uploadFile = require('../../auth/controllers/uploadFile');
const addSample = require('../../auth/controllers/addSample');
const removeSample = require('../../auth/controllers/removeSample');

module.exports = {
    login,
    signin,
    signout,
    addChunk,
    removeChunk,
    updateSample,
    uploadFile,
    addSample,
    removeSample,
};
