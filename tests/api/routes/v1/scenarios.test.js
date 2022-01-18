require('regenerator-runtime');
const request = require('supertest');
const dbHandler = require('./db.js');
const app = require('../../../../app.js');

const chunkData = {
    source_wave_url: "https://www.naver.com/",
    target_wave_url: "https://www.youtube.com/",
    segments: [{
      start_time: 1.01,
      end_time: 2.21,
      source_text: "이것은 정크 데이터 입니다.",
      target_text: "This is a junk datum"
    },{
      start_time: 2.32,
      end_time: 3.21,
      source_text: "이것은 정크 데이터 입니다.",
      target_text: "This is a junk datum"
    },{
      start_time: 8.77,
      end_time: 9.61,
      source_text: "이것은 정크 데이터 입니다.",
      target_text: "This is a junk datum"
    }]
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
            .post('/api/v1/chunks')
            .type('application/json')
            .send({source_wave_url: chunkData.source_wave_url});        
            chunkID = res.body.data._id;        
   
            expect(res.status).toStrictEqual(201);
    });

    it('[PATCH] TTS 완료시 200 응답', async() => { 
        const res = await request(app)
        .patch(`/api/v1/chunks/${ chunkID }`)
        .type('application/json')
        .send({
            status: "2",
            target_wave_url: chunkData.target_wave_url,
            segments: chunkData.segments
        });
        
        expect(res.status).toStrictEqual(200);
    });

});