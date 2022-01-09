# apeach-back [dub-ai]
## 0. Version
node: v16.13.1
<br/>
npm: 8.1.2

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
│                └── chunks.test.js
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
  
## 4. data reference
<image src="https://user-images.githubusercontent.com/39179946/148674584-9dd9e605-959f-43d6-bbfc-4a687919e812.png"/>

## 5. 유닛 테스트
<image src="https://user-images.githubusercontent.com/39179946/148551241-49fdd83b-7bc7-4538-a061-6d4a2d9eb23d.png"/>
