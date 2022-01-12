require('regenerator-runtime');
const request = require('supertest');
const dbHandler = require('./db.js');
const app = require('../../../../app.js');

const createChunkData = {
    source_wave_url: "source_wave_url"
};

const createNewChunkData = {
    status: "1",
    source_text: "hello!"
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

describe("POST /api/chunks", () => {
    it('chunks 등록 성공시 201 응답', async() => { 
        for (let iter = 0; iter < 10; iter++) {
            const res = await request(app)
            .post('/api/chunks')
            .type('application/json')
            .send(createChunkData);        
            chunkID = res.body.data._id;        
            expect(res.status).toStrictEqual(201);
        }
    });
    
    it('source_wave_url없이 chunks 등록 성공시 400 응답', async() => { 
        const res = await request(app)
        .post('/api/chunks')
        .type('application/json');          
         
        expect(res.status).toStrictEqual(400);
    });
    
    it('params에 값이 있을 경우 400 응답', async() => { 
        const res = await request(app)
        .post('/api/chunks/asdfasd')
        .type('application/json')
        .send(createChunkData);

        expect(res.status).toStrictEqual(400);
    });
});


describe("GET /api/chunks", () => {
    it('모든 chunks 조회 성공시 200 응답', async() => { 
        const res = await request(app)
        .get('/api/chunks')
        
        await expect(res.status).toStrictEqual(200);
        expect(res.body.data.length).toStrictEqual(10);
    });
});


describe("GET /api/chunks/:id", () => {
    it('chunks id 조회 성공시 200 응답', async() => { 
        const res = await request(app)
        .get(`/api/chunks/${chunkID}`)

        expect(res.status).toStrictEqual(200);
    });
    
    it('chunks id 조회 실패시 404 응답', async() => { 
        const res = await request(app)
        .get(`/api/chunks/61d7f51cb51a2c7e5240d33e`);
        
        expect(res.status).toStrictEqual(404);
    });

    it('잘못된 형식의 chunks id 요청시 성공시 400 응답', async() => { 
        const res = await request(app)
        .get(`/api/chunks/123`)
        .type('application/json');

        expect(res.status).toStrictEqual(400);
    });
});

describe("PATCH /api/chunks", () => {
    it('chunk 업데이트 완료시 200 응답', async() => { 
        const res = await request(app)
        .patch(`/api/chunks/${ chunkID }`)
        .type('application/json')
        .send(createNewChunkData);
        
        expect(res.status).toStrictEqual(200);
    });
    
    it('id를 명시하지 않았을 경우 400 응답', async() => { 
        const res = await request(app)
        .patch(`/api/chunks`)
        .type('application/json')
        .send(createNewChunkData);
        
        expect(res.status).toStrictEqual(400);
    });
    
    it('chunk를 찾지 못했을 경우 404 응답', async() => { 
        const res = await request(app)
        .patch(`/api/chunks/61d7f51cb51a2c7e5240d33e`)
        .type('application/json')
        .send(createNewChunkData);
        
        expect(res.status).toStrictEqual(404);
    });
    
    it('chunk의 id 형식이 틀릴 경우 400 응답', async() => { 
        const res = await request(app)
        .patch(`/api/chunks/61d7f51cb5e`)
        .type('application/json')
        .send(createNewChunkData);
        
        expect(res.status).toStrictEqual(400);
    });
});


describe("DELETE /api/chunks/:id", () => {
    it('chunks id 삭제 성공시 200 응답', async() => { 
        const res = await request(app)
        .delete(`/api/chunks/${ chunkID }`);
        
        expect(res.status).toStrictEqual(200);
    }); 
    
    it('chunks id 조회 실패시 404 응답', async() => { 
        const res = await request(app)
        .delete(`/api/chunks/61d7f51cb51a2c7e5240d33e`);
        
        expect(res.status).toStrictEqual(404);
    });

    it('잘못된 형식의 chunks id 요청시 성공시 400 응답', async() => { 
        const res = await request(app)
        .get(`/api/chunks/123`)
        .type('application/json');

        expect(res.status).toStrictEqual(400);
    });
});

describe("DELETE /api/chunks", () => {
    it('모든 chunk 삭제 완료시 200 응답', async() => { 
        const res = await request(app)
        .delete(`/api/chunks`);

        expect(res.status).toStrictEqual(200);
    });
});
