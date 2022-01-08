# apeach-back [dub-ai]

## <a href="https://seo-jun-pyo.gitbook.io/apeach-back/"> 1. 깃북 <a/>

## 2. 폴더구조
```bash
├── api
│    ├── routes
│    │      ├── index.js
│    │      ├── chunks
│    │      │      ├── index.js
│    │      │      └── chunks.controller.js
│    │      └── audios
│    │             ├── index.js
│    │             └── audios.controller.js
│    └── middlewares  
│          ├── index.js
│          ├── isRequired.js
│          └── isValidID.js
│
├── loaders
│      ├── express.js
│      ├── gcStorage.js
│      ├── logger.js
│      └── mongoose.js
│  
├── tests
│     └── api
│          └── routes
│                ├── db.js
│                └── chunk.test.js
├── models
│     └── chunk.js
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
## 3. 벡엔드 인프라
<image src="https://user-images.githubusercontent.com/39179946/148075429-0e935de1-cd7d-46c5-8acf-0eef86cd8595.jpeg"/>

## 4. 유닛 테스트
<image src="https://user-images.githubusercontent.com/39179946/148551241-49fdd83b-7bc7-4538-a061-6d4a2d9eb23d.png"/>
