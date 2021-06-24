const jwt = require('jsonwebtoken');
const User = require('../database/models/').sequelize.models.Users;
const Article = require('../database/models/').sequelize.models.Articles;
const Comment = require('../database/models/').sequelize.models.Comments;

const config = require('../config');
const logger = require('../logger');


// Middelware d'authentification général pour toutes les routes
exports.generalAuth = (req, res, next) => {
  try {
    //   on récupere le token dans le header (forme "Bearer <token>" à parser)
    const token = req.headers.authorization.split(' ')[1];
    // On décode le token pour récupérer le user encrypté dedans
    const decodedToken = jwt.verify(token, config.sessionTokenSecret);
    const userId = decodedToken.userId;
    // On controle le user décrypté par rapport au userID fourni dans la requette
    if (req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    logger.error(`Invalid user ID {userId : ${req.body.userId}}`);
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};


// Middlewares spécifique aux routes de modification/suppression d'un élément par son propriétaire
// Vérifie que le user qui fait la demande est le proprietaire/créateur de cet élément

exports.checkUserOwner = (req, res, next) => {
  if (req.body.userId !== parseInt(req.params.id)){
    res.status(403).json({error: new Error('Forbidden request!')});
  } else {
    next();
  }
};


exports.checkArticleOwner = (req, res, next) => {
  try {
    Article.findOne({ where: { id: req.params.id } })
    .then(article => {
      // Comparer le user courant au user propriétaire de la sauce à modifier
      if(article.userId !== req.body.userId){
        // On regarde si le user qui veut modifier est admin sinon on rejette
        User.findOne({ where: { id: req.body.userId } })
        .then(user => {
          if(! user.isAdmin){
            logger.error(`Forbidden request : user is not the owner of the ressource {userId : ${req.body.userId}}`);
            throw "Forbidden request : user is not the owner of the ressource";
          }
          else{next();}
        })
        .catch( err => res.status(401).json({error: err}));
      }
      else{next();}
    })
    .catch( err => res.status(401).json({error: err}));
  } catch (err){
    res.status(403).json({
      error: new Error('Forbidden request!')
    });
  }
};


exports.checkCommentOwner = (req, res, next) => {
  try {
    Comment.findOne({ where: { id: req.params.id } })
    .then(comment => {
      // Comparer le user courant au user propriétaire de la sauce à modifier
      if(comment.userId !== req.body.userId){
        // On regarde si le user qui veut modifier est admin sinon on rejette
        User.findOne({ where: { id: req.body.userId } })
        .then(user => {
          if(! user.isAdmin){
            logger.error(`Forbidden request : user is not the owner of the ressource {userId : ${req.body.userId}}`);
            throw "Forbidden request : user is not the owner of the ressource";
          }
          else{next();}
        })
        .catch( err => res.status(401).json({error: err}));
      }
      else{next();}
    })
    .catch( err => res.status(401).json({error: err}));
  } catch (err){
    res.status(403).json({
      error: new Error('Forbidden request!')
    });
  }
};