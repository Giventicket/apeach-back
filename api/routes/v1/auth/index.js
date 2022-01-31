const express = require('express');
const controller = require('./controllers/index');
const decodeAccessToken = require('../middlewares/decodeAccessToken');

const router = express.Router();

router.post('/signin', controller.signin);
router.delete('/signout', decodeAccessToken, controller.signout);
router.get('/login', controller.login);

module.exports = router;
