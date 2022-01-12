const express = require('express');
const router = express.Router();

const audios = require('./audios/index')
const chunks = require('./chunks/index');
const engines = require('./engines/index');

router.use('/chunks', chunks);
router.use('/audios', audios);
router.use('/engines', engines);

module.exports = router;