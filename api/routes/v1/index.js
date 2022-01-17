const express = require('express');
const router = express.Router();

const audios = require('./audios/index')
const chunks = require('./chunks/index');


router.use('/chunks', chunks);
router.use('/audios', audios);

/*
const worker = require('worker_threads')
const asyncErrorWrapper = require('./public/asyncErrorWrapper.js');

const asyncFunc = async(req, res, next) => {
  for(let iter=0; iter<1000; iter++)
    process.stdout.write("");
  console.log(worker);
  res.status(203).json({test : "test"})
};

const r1 = router.get('/a', asyncErrorWrapper(asyncFunc));
router.use('/tests', r1);
*/

module.exports = router;