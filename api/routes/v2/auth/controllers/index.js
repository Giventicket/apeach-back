const login = require('./login');
const signup = require('./signup');
const signout = require('./signout');
const checkSample = require('./checkSample');
const logout = require('./logout');
const silentRefresh = require('./silentRefresh');
const preprocess = require('./preprocess');
const parseForm = require('./parseForm');
const uploadAudio = require('./uploadAudio');
const updateUserAfterUploadAudio = require('./updateUserAfterUploadAudio');
const checkFile = require('./checkFile');
const updateUser = require('./updateUser');

module.exports = {
    login,
    signup,
    signout,
    checkSample,
    logout,
    silentRefresh,
    preprocess,
    parseForm,
    uploadAudio,
    updateUserAfterUploadAudio,
    checkFile,
    updateUser,
};
