const jwt = require('jsonwebtoken');
const User = require('../database/models/').sequelize.models.Users;
const Article = require('../database/models/').sequelize.models.Articles;
const Comment = require('../database/models/').sequelize.models.Comments;

const config = require('../config');
const logger = require('../logger');


function tokenDecode(authorization){
  // on récupere le token dans le header (forme "Bearer <token>" à parser)
  const token = authorization.split(' ')[1];
  // On décode le token pour récupérer le user encrypté dedans
  const decodedToken = jwt.verify(token, config.sessionTokenSecret);
  return decodedToken.userId;
}


// Middelware d'authentification général pour toutes les routes
exports.generalAuth = (req, res, next) => {
  try {
    const userId = tokenDecode(req.headers.authorization);
    // On controle le user décrypté par rapport au userID fourni dans la requette (sauf pour les requettes GET)
    if (req.body.userId && req.body.userId !== userId) {
      throw new Error('Invalid userId or auth token');
    } else {
      next();
    }
  } catch (error) {
    logger.error(`Invalid user ID {userId : ${req.body.userId}}`);
    res.status(401).json({
      error: error.message
    });
  }
};


// Middelwares d'autorisation
// Vérifie que le user qui fait la demande est le propriétaire/créateur de cet élément, ou éventuellement un admin


exports.checkUserOwner = (req, res, next) => {
  try {
    const userId = tokenDecode(req.headers.authorization);
    // On contrôle si le userId demandé en paramètre est bien le même que celui
    // chiffré dans le token
    if (req.params.id === userId) {
      logger.error(`Forbidden request : user is not the owner of the ressource {userId : ${req.params.id}}`);
      throw new Error('Forbidden request!');
    } else {
      next();
    }
  } catch (error) {
    res.status(403).json({error: error.message});
  }
};


exports.checkArticleOwner = (req, res, next) => {
  try {
    const userId = tokenDecode(req.headers.authorization);
    // On contrôle si le userId de l'article cible est bien le même que celui
    // chiffré dans le token
    Article.findOne({ where: { id: req.params.id } })
    .then(article => {
      // Comparer le user courant au user propriétaire de la sauce à modifier
      if(article.userId !== userId){
        // On regarde si le user qui veut modifier est admin sinon on rejette
        User.findOne({ where: { id: userId } })
        .then(user => {
          if(! user.isAdmin){
            logger.error(`Forbidden request : user is not the owner of the ressource {userId : ${userId}}`);
            throw new Error("Forbidden request : user is not the owner of the ressource");
          }
          else{next();}
        })
        .catch( err => res.status(401).json({error: err.message}));
      }
      else{next();}
    })
    .catch( err => res.status(401).json({error: err.message}));
  } catch (err){
    res.status(403).json({
      error: err.message
    });
  }
};


exports.checkCommentOwner = (req, res, next) => {
  try {
    const userId = tokenDecode(req.headers.authorization);
    // On contrôle si le userId du commentaire cible est bien le même que celui
    // chiffré dans le token
    Comment.findOne({ where: { id: req.params.id } })
    .then(comment => {
      // Comparer le user courant au user propriétaire du commentaire à modifier
      if(comment.userId !== userId){
        // On regarde si le user qui veut modifier est admin sinon on rejette
        User.findOne({ where: { id: userId } })
        .then(user => {
          if(! user.isAdmin){
            logger.error(`Forbidden request : user is not the owner of the ressource {userId : ${userId}}`);
            throw new Error("Forbidden request : user is not the owner of the ressource");
          }
          else{next();}
        })
        .catch( err => res.status(401).json({error: err.message}));
      }
      else{next();}
    })
    .catch( err => res.status(401).json({error: err.message}));
  } catch (err){
    res.status(403).json({
      error: err.message
    });
  }
};