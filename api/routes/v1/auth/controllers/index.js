const login = require('./login');
const signup = require('./signup');
const signout = require('./signout');
const addChunk = require('../../auth/controllers/addChunk');
const removeChunk = require('../../auth/controllers/removeChunk');
const updateSample = require('./addSample');
const uploadFile = require('../../auth/controllers/uploadFile');
const addSample = require('../../auth/controllers/addSample');
const removeSample = require('../../auth/controllers/removeSample');

module.exports = {
    login,
    signup,
    signout,
    addChunk,
    removeChunk,
    updateSample,
    uploadFile,
    addSample,
    removeSample,
};
