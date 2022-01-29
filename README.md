# apeach-back [dub-ai]

<img src="https://user-images.githubusercontent.com/39179946/148715614-9e50c8d3-338b-4af0-b109-dca28342155b.png"/>

## 0. Version
node: v16.13.1
<br/>
npm: 8.1.2
<br/>

```bash
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
git clone https://github.com/Giventicket/apeach-back.git
cd apeach-back/
npm install
npm test
npm start

swagger: http://localhost/api-docs/
```

## 1. 폴더구조

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

## 2. 데이터 구조
<image src="https://user-images.githubusercontent.com/39179946/150734582-229db647-ec15-4b0f-a6d5-79c1eb884713.png"/>

## 3. 벡엔드 인프라

<image src="https://user-images.githubusercontent.com/39179946/150832083-20edd0a4-57e8-4d15-b010-e2ad1aa6516e.png"/>

```bash
Instance: Ubuntu18.04, 2 CPU Core(2 siblings), GCP compute engine
Loadbalancer: PM2
Processes: Node.js(NODE_APP_INSTANCE 0), Node.js(NODE_APP_INSTANCE 1)
Schedulers: Only in Node.js(NODE_APP_INSTANCE 0)
DataBase: MongoDB, GCP Storage Bucket
Message/Queue: GCP Pub/Sub
Notification: Discord
```

## 4. 데이터 플로우
| <image src="https://user-images.githubusercontent.com/39179946/150782677-0cf9d0f4-9b85-4df2-8d3e-daa0afb318ad.png"/> | <image src="https://user-images.githubusercontent.com/39179946/150782733-8f77a94f-5fd6-4ddf-a42a-082a24564836.png"/> |
| ------------- | ------------- |
| <image src="https://user-images.githubusercontent.com/39179946/150783851-c25e8248-9243-4bdd-bda9-95a2244b7f77.png"/> | <image src="https://user-images.githubusercontent.com/39179946/150783866-18a278f6-e275-4bfc-8edf-b6a8711d3d75.png"/> |
| <image src="https://user-images.githubusercontent.com/39179946/150783881-69a19bf3-2ec0-4f2f-84a6-7966e8c21a15.png"/> | <image src="https://user-images.githubusercontent.com/39179946/150783901-d8a91681-5a25-4e4c-a93f-c6e068abbaa5.png"/> |

## 5. 스케쥴러
| 디스코스 웹훅 전송 스케줄러  | 구글 버킷 삭제 스케줄러 |
| ------------- | ------------- |
| <image src="https://user-images.githubusercontent.com/39179946/150819434-04d36e91-710e-4dec-9b12-71cf48fa9f01.png"/> | <image src="https://user-images.githubusercontent.com/39179946/150819701-b823b27c-5c05-443a-8814-555caa890129.png"/> |

```bash
디스코스 웹훅 전송 스케줄러: 
1초에 3개씩 pub/sub(apeach-webhook-sub)의 message를 pull해 온다. 그 뒤 discord에 웹훅을 전송한다. 
1초에 5번 초과의 웹훅을 전송하면 429(too many requests) 에러가 발생하는데 이렇게 전송 실패한 웹훅은 다시 pub/sub의(topics/apeach-webhook) 메세지로 publish된다.

구글 버킷 삭제 스케줄러: 
1초에 20개씩 pub/sub(apeach-bucket-delete-sub)의 message를 pull해 온다. 그 뒤 bucket에서 해당 데이터를 삭제한다. 
1초에 30번 초과의 웹훅을 전송하면 429(too many requests) 에러가 발생하는데 이렇게 전송 실패한 명령은 다시 pub/sub의(topics/apeach-bucket-delete) 메세지로 publish된다.

* 각 스케줄러는 active할 때 또 다른 스케줄러를 생성하지 않는다.
```

## 6. 유닛 테스트
<image src="https://user-images.githubusercontent.com/39179946/148551241-49fdd83b-7bc7-4538-a061-6d4a2d9eb23d.png"/>
