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
const parseFile = require('./parseFile');
const updateAgreed = require('./updateAgreed');
const updateSampleFinished = require('./updateSampleFinished');

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
    parseFile,
    updateAgreed,
    updateSampleFinished,
};
