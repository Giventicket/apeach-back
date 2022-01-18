const Chunk = require('../../../../../models/v1/chunk/index');
const asyncErrorWrapper = require('../../public/asyncErrorWrapper.js');

const getChunks = asyncErrorWrapper((req, res, next) => {
    return Chunk.find({ }).then((chunks) => {
      res.status(200).json({ 
        message: "Find success [find all]", 
        data: chunks 
      });
    });
});

module.exports = getChunks;