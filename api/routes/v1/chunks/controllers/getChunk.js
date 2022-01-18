const Chunk = require('../../../../../models/v1/chunk/index');
const asyncErrorWrapper = require('../../public/asyncErrorWrapper.js');

const getChunk = asyncErrorWrapper((req, res, next) => {
    return Chunk.findOne({_id: req.params.id}).then((chunk) => {
      if (chunk == null) {
        const err = new Error(`Cannot find ${ req.params.id }`);
        err.status = 404;
        throw err;
      }
      res.status(200).json({ 
          message: `Find success [find ${ req.params.id }]`, 
          data: chunk 
      });
    }); 
});

module.exports = getChunk;