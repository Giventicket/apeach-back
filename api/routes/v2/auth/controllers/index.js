const login = require('./login');
const signup = require('./signup');
const signout = require('./signout');
const checkSample = require('./checkSample');
const logout = require('./logout');
const silentRefresh = require('./silentRefresh');
const preprocess = require('./preprocess');
const uploadAudio = require('./uploadAudio');
const updateUserAfterUploadAudio = require('./updateUserAfterUploadAudio');
const checkFile = require('./checkFile');
const updateUser = require('./updateUser');
const parseFile = require('./parseFile');

module.exports = {
    login,
    signup,
    signout,
    checkSample,
    logout,
    silentRefresh,
    preprocess,
    uploadAudio,
    updateUserAfterUploadAudio,
    checkFile,
    updateUser,
    parseFile,
};
