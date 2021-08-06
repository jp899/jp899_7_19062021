# Jean-PaulNavailles_7_19062021
Project n°7 of OpenClassrooms Web Developer training : Building of an enterprise social network

## Getting started

### Back-end : Install and launch the back-end server

This project has been developped/tested with node version v16.2.0.

#### Configure environment variables

Create a .env file in the root directory of the repository. 
The required variables are listed in the file .env.example .

#### Install and launch the server
```
cd Jean-PaulNavailles_6_02062021
npm install
npm start
```

### Front-end

The Front-end part is not included in this repository. 
You need to clone [this repository](https://github.com/OpenClassrooms-Student-Center/dwj-projet6) and follow its installation and launch instructions.


## Modules used
- **express**, to build the HTTP API server.
- **mysql2**, to interact with the mysql Database.
- **sequelize**, to interact with the mysql Database.
- **dotenv**, to manage environment variables.
- **winston**, to manage logs.
- **multer**, to handle file uploading.
- **jsonwebtoken**, to secure authentification on requests.
- **bcrypt**,  to hash passwords.
- **crypto-js**,  to encrypt email adresses.
- **helmet**, to ensure protection against various threats, inculding XSS vulnerabilities.
- **epress-rate-limit**, to block login requests after 5 failed atempts.


# front

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
