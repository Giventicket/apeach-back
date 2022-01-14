require('regenerator-runtime');
const request = require('supertest');
const dbHandler = require('./db.js');
const app = require('../../../../app.js');

const createChunkData = {
    source_wave_url: "source_wave_url"
};

const createNewChunkData = {
    status: "1",
    segments: [{
      start_time: 1.01,
      end_time: 2.21,
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

describe("POST /api/v1/chunks", () => {
    it('chunks 등록 성공시 201 응답', async() => { 
        for (let iter = 0; iter < 10; iter++) {
            const res = await request(app)
            .post('/api/v1/chunks')
            .type('application/json')
            .send(createChunkData);        
            chunkID = res.body.data._id;        
            expect(res.status).toStrictEqual(201);
        }
    });
    
    it('source_wave_url없이 chunks 등록 성공시 400 응답', async() => { 
        const res = await request(app)
        .post('/api/v1/chunks')
        .type('application/json');          
         
        expect(res.status).toStrictEqual(400);
    });
});


describe("GET /api/v1/chunks", () => {
    it('모든 chunks 조회 성공시 200 응답', async() => { 
        const res = await request(app)
        .get('/api/v1/chunks')
        
        await expect(res.status).toStrictEqual(200);
        expect(res.body.data.length).toStrictEqual(10);
    });
});


describe("GET /api/v1/chunks/:id", () => {
    it('chunks id 조회 성공시 200 응답', async() => { 
        const res = await request(app)
        .get(`/api/v1/chunks/${chunkID}`)

        expect(res.status).toStrictEqual(200);
    });
    
    it('chunks id 조회 실패시 404 응답', async() => { 
        const res = await request(app)
        .get(`/api/v1/chunks/61d7f51cb51a2c7e5240d33e`);
        
        expect(res.status).toStrictEqual(404);
    });
});

describe("PATCH /api/v1/chunks", () => {
    it('chunk 업데이트 완료시 200 응답', async() => { 
        const res = await request(app)
        .patch(`/api/v1/chunks/${ chunkID }`)
        .type('application/json')
        .send(createNewChunkData);
        
        expect(res.status).toStrictEqual(200);
    });

    it('chunk를 찾지 못했을 경우 404 응답', async() => { 
        const res = await request(app)
        .patch(`/api/v1/chunks/61d7f51cb51a2c7e5240d33e`)
        .type('application/json')
        .send(createNewChunkData);
        
        expect(res.status).toStrictEqual(404);
    });
});


describe("DELETE /api/v1/chunks/:id", () => {
    it('chunks id 삭제 성공시 200 응답', async() => { 
        const res = await request(app)
        .delete(`/api/v1/chunks/${ chunkID }`);
        
        expect(res.status).toStrictEqual(200);
    }); 
    
    it('chunks id 조회 실패시 404 응답', async() => { 
        const res = await request(app)
        .delete(`/api/v1/chunks/61d7f51cb51a2c7e5240d33e`);
        
        expect(res.status).toStrictEqual(404);
    });
});

describe("DELETE /api/v1/chunks", () => {
    it('모든 chunk 삭제 완료시 200 응답', async() => { 
        const res = await request(app)
        .delete(`/api/v1/chunks`);

        expect(res.status).toStrictEqual(200);
    });
});
