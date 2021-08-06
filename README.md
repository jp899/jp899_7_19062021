# Jean-PaulNavailles_7_19062021
Project n°7 of OpenClassrooms Web Developer training : Building of an enterprise social network


## Getting started

git clone https://github.com/jpnavailles/Jean-PaulNavailles_7_19062021.git

This project has been developped/tested under node version v16.3.0.

### BACK-END

#### Configure environment variables

First create a .env file in the Jean-PaulNavailles_7_19062021/back/ directory. 
The required variables are listed in the .env.example file.

#### Install and launch
```
cd Jean-PaulNavailles_7_19062021/back/
npm install
npm start
```

### FRONT-END

#### Install and launch
```
cd Jean-PaulNavailles_7_19062021/front/
npm install
npm run serve
```


## Modules used

### BACK-END

- **express**, to build the HTTP API server.
- **mysql2**, mysql client.
- **sequelize**, ORM to interact with the Database.
- **dotenv**, to manage environment variables.
- **winston**, to manage logs.
- **multer**, to handle file uploading.
- **jsonwebtoken**, to secure authentification on requests.
- **bcrypt**,  to hash passwords.
- **crypto-js**,  to encrypt email adresses.
- **helmet**, to ensure protection against various threats, inculding XSS vulnerabilities.
- **epress-rate-limit**, to block login requests after 5 failed atempts.

### FRONT-END

- **vue2**, Single Page Application (SPA) front-end framework.
- **vue-router**, to handle navigation inside the SPA.
- **bootstrap-vue**, to use bootstrap's Grid and responsive components.
- **fontawesome**, for the nice icons.
- **sass**, CSS preprocessor.

