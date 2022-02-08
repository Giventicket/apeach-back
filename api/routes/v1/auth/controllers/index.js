const login = require('./login');
const signup = require('./signup');
const signout = require('./signout');
const addChunk = require('./addChunk');
const removeChunk = require('./removeChunk');
const updateSample = require('./updateSample');
const uploadFile = require('./uploadFile');
const logout = require('./logout');
const silentRefresh = require('./silentRefresh');

module.exports = {
    login,
    signup,
    signout,
    addChunk,
    removeChunk,
    updateSample,
    uploadFile,
    logout,
    silentRefresh,
};
