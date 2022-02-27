# apeach-back [dub-ai]
<a href="https://dub-ai.site/">두바이 바로가기</a>

## 0. Version
node: v16.13.1
<br/>
npm: 8.1.2
<br/>

```bash
sudo apt update
sudo apt install ffmpeg
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
│    └── routes
│          ├── index.js
│          └── v2
│              ├── index.js
│              ├── ai
│              │    ├── index.js
│              │    └── controllers
│              │            ├── index.js
│              │            ├── getChunk.js
│              │            ├── getUser.js
│              │            ├── stt.js
│              │            ├── translate.js
│              │            └── tts.js
│              ├── auth
│              │      ├── index.js
│              │      └── controllers
│              │               ├── index.js
│              │               ├── checkFile.js
│              │               ├── checkSample.js
│              │               ├── login.js
│              │               ├── logout.js
│              │               ├── parseFile.js
│              │               ├── preprocess.js
│              │               ├── signout.js
│              │               ├── signup.js
│              │               ├── silentRefresh.js
│              │               ├── updateAgreed.js
│              │               ├── updateSampleFinished.js
│              │               ├── updateUser.js
│              │               ├── updateUserAfterUploadAudio.js
│              │               └── uploadAudio.js
│              ├── chunks
│              │      ├── index.js
│              │      └── controllers
│              │               ├── index.js
│              │               ├── checkFile.js
│              │               ├── createChunk.js
│              │               ├── deleteChunk.js
│              │               ├── parseFile.js
│              │               ├── preprocess.js
│              │               ├── updateChunk.js
│              │               ├── updateUserAfterCreateChunk.js
│              │               ├── updateUserAfterDeleteChunk.js
│              │               └── uploadAudio.js
│              ├── middlewares
│              │      ├── decodeToken.js
│              │      └── isEmailAndPasswordNotNull.js
│              ├── models
│              │      ├── index.js
│              │      └── controllers
│              │               ├── index.js
│              │               ├── getSamplesByName.js
│              │               ├── getModel.js
│              │               ├── getModels.js
│              │               ├── getUser.js
│              │               ├── parseFile.js
│              │               ├── tts.js
│              │               ├── updateModel.js
│              │               └── uploadModel.js
│              └── users
│                     ├── index.js
│                     └── controllers
│                              ├── index.js
│                              └── getSamplesByName.js
│
├── loaders
│      ├── express.js
│      ├── mongoose.js
│      └── swagger.js
│
├── models
│     └── v2
│          ├── chunk
│          |      ├── index.js
│          |      └── chunk.js
│          ├── model
│          |      ├── index.js
│          |      └── model.js
│          ├── token
│          |      ├── index.js
│          |      └── token.js
│          └── user
│                 ├── index.js
│                 └── user.js
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
│     ├── api
│     |    └── routes
|     |           └── v1
│     |               ├── db.js
│     |               ├── scenarios.test.js
│     |               └── chunks.test.js
|     └── artillery
|            └── test.yaml
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

<image src="https://user-images.githubusercontent.com/39179946/155265732-798c91e4-b6ee-47be-9c0f-4e943eb8257a.png"/>

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

## 4. sample voice 녹음 후 모델 생성 플로우
| <image src="https://user-images.githubusercontent.com/39179946/155266049-fb676bb2-94da-471c-862f-20de2ac2148f.png"/> | <image src="https://user-images.githubusercontent.com/39179946/155266111-65379685-60f1-4fbf-b6d3-f1e2608ce80d.png"/> |
| ------------- | ------------- |
| <image src="https://user-images.githubusercontent.com/39179946/155266214-d43d81ec-3db8-41a0-9f59-d565bc52c8d9.png"/> | <image src="https://user-images.githubusercontent.com/39179946/155266252-2a42e869-ec04-417d-a4a5-ca9222f7d6c3.png"/> |
| <image src="https://user-images.githubusercontent.com/39179946/155266322-53b3fd23-5375-4158-87c6-c333e47e90ee.png"/> | |


## 5. dubbing 플로우
| <image src="https://user-images.githubusercontent.com/39179946/155266438-75c6af0c-bd78-452b-88eb-baa5cce7ee1c.png"/> | <image src="https://user-images.githubusercontent.com/39179946/155266452-db6fb7cc-d2a1-4f2b-9c4c-ddc7e2c5ac71.png"/> |
| ------------- | ------------- |
| <image src="https://user-images.githubusercontent.com/39179946/155266468-fbca9ca7-9c2f-460b-84c1-8190ba7e2ec7.png"/> | <image src="https://user-images.githubusercontent.com/39179946/155266479-3036dfcd-32ee-439e-9a93-97a8ca6a5203.png"/> |
| <image src="https://user-images.githubusercontent.com/39179946/155266495-594a3da0-99b6-4c3d-8d44-690e320b0df7.png"/> | <image src="https://user-images.githubusercontent.com/39179946/155266505-f8263cc0-d96a-4a80-b05c-888d70e68d2a.png"/> |

## 6. 스케쥴러
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

## 7. 유닛 테스트(deprecated)
<image src="https://user-images.githubusercontent.com/39179946/148551241-49fdd83b-7bc7-4538-a061-6d4a2d9eb23d.png"/>
