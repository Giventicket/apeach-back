const express = require('express');
const Chunk = require('../schemas/chunk');

const router = express.Router();

// [post] chunk 생성하기
router.post('/', async (req, res, next) => {
    try {
        const chunk = await Chunk.create({
            status: req.body.status,
            source_wave_url: req.body.source_wave_url,
            source_text: req.body.source_text,
            target_text: req.body.target_text,
            target_wave_url: req.body.target_wave_url,
        });
        console.log(chunk);
        res.status(201).json({ 
            message: `Create success[create ${chunk._id}}]`, 
            data: {_id: chunk._id} 
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
});

// [get] 매칭 되는 chunk 가져오기
router.get('/:id', async (req, res, next) => {
    try {
        const chunk = await Chunk.find({_id: req.params.id}); 
        console.log(chunk.length);
        if(chunk.length == 0)
            res.status(404).json({ message: `Cannot find ${req.params.id}`, data: {} });
        res.status(200).json({ message: `Find success [find ${req.params.id}]`, data: chunk });
    } catch (error) {
        console.log(error);
        next(error);
    }
});

// [get] 전체 chunk 가져오기
router.get('/', async (req, res, next) => {
    try {
        const chunks = await Chunk.find({});
        res.status(200).json({ 
            message: "Find success [find all]", 
            data: chunks 
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
});

// [update] chunk update 하기
router.patch('/:id', async (req, res, next) => {
    try {
        const result = await Chunk.findOneAndUpdate({ _id: req.params.id }, { 
            status: req.body.status,
            source_wave_url: req.body.source_wave_url,
            source_text: req.body.source_text,
            target_text: req.body.target_text,
            target_wave_url: req.body.target_wave_url,
        });
        if (result === null) 
             res.status(404).json({ message: `Cannot find ${req.params.id}`, data: {} });
        const chunk = await Chunk.find({_id: req.params.id}); 
        res.status(200).json({ message: `update success [find ${req.params.id}]`, data: chunk });
        console.log(result);
    } catch (error) {
        console.log(error);
        next(error);
    }
});

// [delete] id에 매칭되는 chunk 하나 삭제하기
router.delete("/:id", async (req, res, next) => {
    try {
        const result = await Chunk.deleteOne({ _id: req.params.id });
        if (result.deletedCount === 0) {
            res.status(404).json({ 
                message: `Cannot find ${req.params.id}`, 
                data: {} 
            });        
        }
        res.status(200).json({
            message: `Delete success [delete ${req.params.id}]`,
            data: {}
        });
    } catch (error) {
        console.log(error);
        next(error);
    }  
});

// [delete] 모두 삭제
router.delete("/", async (req, res, next) => {
    try {
        await Chunk.deleteMany({ });
        res.status(200).json({
            message: "Delete success [delete all]",
            data: {}
        });
    } catch (error) {
        console.log(error);
        next(error);
    }  
});


module.exports = router;