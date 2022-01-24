# apeach-back [dub-ai]

<img src="https://user-images.githubusercontent.com/39179946/148715614-9e50c8d3-338b-4af0-b109-dca28342155b.png"/>

## 0. Version

<br/>
node: v16.13.1
<br/>
npm: 8.1.2
<br/>
<b>curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -<b/>
<br/>
<b>sudo apt-get install -y nodejs<b/>
<br/>
<b>git clone https://github.com/Giventicket/apeach-back.git<b/>
<br/>
<b>cd apeach-back/<b/>
<br/>
<b>npm install<b/>
<br/>
<b>npm test<b/>
<br/>
<b>npm start<b/>
  
## <a href="https://seo-jun-pyo.gitbook.io/apeach-back/"> 1. 깃북 <a/>

## 2. 폴더구조

```bash
├── api
│    ├── routes
│    │      ├── index.js
│    │      └── v1
│    │          ├── index.js
│    │          ├── audios
│    │          │      ├── index.js
│    │          │      └── controllers
│    │          │               ├── index.js
│    │          │               ├── checkFile.js
│    │          │               ├── deleteFile.js
│    │          │               ├── parseForm.js
│    │          │               ├── preprocess.js
│    │          │               └── uploadFile.js
│    │          └── chunks
│    │                 ├── index.js
│    │                 └── controllers
│    │                          ├── index.js
│    │                          ├── createChunk.js
│    │                          ├── deleteChunk.js
│    │                          ├── deleteChunks.js
│    │                          ├── getChunk.js
│    │                          ├── getChunks.js
│    │                          └── updateChunk.js
│    └── middlewares
│          ├── index.js
│          ├── isRequired.js
│          └── isValidID.js
│
├── loaders
│      ├── express.js
│      ├── mongoose.js
│      └── swagger.js
│
├── models
│     └── v1
│          └── chunk
│                ├── index.js
│                └── chunk.js
├── utils
│     ├── asyncAudioDelete.js
│     ├── asyncAudioValidate.js
│     ├── asyncErrorLoggerWrapper.js
│     ├── asyncErrorWrapper.js
│     ├── asyncFileDelete.js
│     ├── asyncParseForm.js
│     ├── asyncPreprocess.js
│     ├── asyncPublishMessageBucket.js
│     ├── asyncPublishMessageWebhook.js
│     ├── asyncSendWebhook.js
│     ├── gcStorage.js
│     └── logger.js
│
├── schedulers
│     ├── jobDeleteAudios.js
│     └── jobSendWebhooks.js
│  
├── tests
│     └── api
│          └── routes
│                ├── db.js
│                └── chunks.test.js
├── app.js
├── package-lock.json
├── package.json
├── jest.config.json
├── babel.config.json
├── README.md
├── .gitignore
├── .env
└── pathfinder-101-$.json
```

## 3. 데이터 구조

<image src="https://user-images.githubusercontent.com/39179946/148674584-9dd9e605-959f-43d6-bbfc-4a687919e812.png"/>

## 4. 벡엔드 인프라

<image src="https://user-images.githubusercontent.com/39179946/148675677-4bdef770-1338-48d3-80b7-17856e123680.png"/>

## 5. 유닛 테스트

<image src="https://user-images.githubusercontent.com/39179946/148551241-49fdd83b-7bc7-4538-a061-6d4a2d9eb23d.png"/>
