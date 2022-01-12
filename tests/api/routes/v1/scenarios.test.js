require('regenerator-runtime');
const request = require('supertest');
const dbHandler = require('./db.js');
const app = require('../../../../app.js');

const chunkData = {
    source_wave_url: "https://www.naver.com/",
    source_text: "이것은 정크 데이터 입니다.",
    target_text: "This is a junk datum",
    target_wave_url: "https://www.youtube.com/",
};

beforeAll(async () => {
    await dbHandler.connect();
});

const asyncAppClose = (app) => {
    return new Promise((resolve, reject) =>{
        app.close(() => {resolve();});
    });
};


afterAll(async () => {
    await dbHandler.closeDatabase();
    await asyncAppClose(app).then();
});

let chunkID;

describe("SCENARIO: 유저가 소스 음성을 등록한 뒤 타켓 음성을 받을때까지의 일련의 과정", () => {
    it('[POST] chunks 등록 성공시 201 응답(status 0)', async() => { 
        const res = await request(app)
            .post('/api/chunks')
            .type('application/json')
            .send({source_wave_url: chunkData.source_wave_url});        
            chunkID = res.body.data._id;        
   
            expect(res.status).toStrictEqual(201);
    });
    
    it('[PATCH] STT 완료시 200 응답', async() => { 
        const res = await request(app)
        .patch(`/api/chunks/${ chunkID }`)
        .type('application/json')
        .send({
            status: "1",
            source_text: chunkData.source_text
        });
        
        expect(res.status).toStrictEqual(200);
    });
    
    it('[PATCH] 번역 완료시 200 응답', async() => { 
        const res = await request(app)
        .patch(`/api/chunks/${ chunkID }`)
        .type('application/json')
        .send({
            status: "2",
            target_text: chunkData.target_text
        });
        
        expect(res.status).toStrictEqual(200);
    });
    
     it('[PATCH] TTS 완료시 200 응답', async() => { 
        const res = await request(app)
        .patch(`/api/chunks/${ chunkID }`)
        .type('application/json')
        .send({
            status: "3",
            target_wave_url: chunkData.target_wave_url
        });
        
        expect(res.status).toStrictEqual(200);
    });

});