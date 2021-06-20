// const db = require('./database/models/');
const Users = require('./database/models/').sequelize.models.Users;
const Articles = require('./database/models/').sequelize.models.Articles;
const Comments = require('./database/models/').sequelize.models.Comments;
const Likes = require('./database/models/').sequelize.models.Likes;


Users.create({
    userName: "moiaussi",
    passwordHash: "passwordHash",
    firstName:"firstName",
    lastName: "lastName",
    emailEncrypted: "emailencrypted"
})
.then((result) => {console.log('OK : ' + result)})
.catch((error) => {console.log('KO : ' + error)});

Articles.create({
    userId: 1,
    title: "Ceci est une image",
    imageUrl:"/ici/ou/la/image.img"
})
.then((result) => {console.log('OK : ' + result)})
.catch((error) => {console.log('KO : ' + error)});

Comments.create({
    userId: 1,
    articleId: 1,
    content: "Waow quelle image fantastique !!",
})
.then((result) => {console.log('OK : ' + result)})
.catch((error) => {console.log('KO : ' + error)});

Likes.create({
    userId: 1,
    articleId: 1,
    liked: -1,
})
.then((result) => {console.log('OK : ' + result)})
.catch((error) => {console.log('KO : ' + error)});

Likes.create({
    userId: 9,
    articleId: 1,
    liked: 0,
})
.then((result) => {console.log('OK : ' + result)})
.catch((error) => {console.log('KO : ' + error)});
