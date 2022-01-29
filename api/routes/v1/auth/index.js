const express = require('express');
const controller = require('./controllers/index');

const router = express.Router();

router.post('/signin', controller.signin);
router.delete('/signout', controller.signout);
router.get('/login', controller.login);
router.get('/logout', controller.logout);

module.exports = router;
