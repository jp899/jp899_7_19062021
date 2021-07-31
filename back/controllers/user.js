const User = require('../database/models/').sequelize.models.Users;
const UniqueConstraintError = require('sequelize').UniqueConstraintError;
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cryptoJS = require('crypto-js');

const config = require('../config');
const logger = require('../logger');


// Regex de contrôle des entrées utilisateur :

// EMAIL : Same regex used to check type="email" input in HTML5.
// Remark : it allows emails without Top Level Domain (ex : admin@mailserver1), which are rare, but possible and valid emails.
const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
// PASSWORD : de 8 à 15 caractères avec au moins : 1 minuscule, 1 majuscule, un chiffre, un caractère spécial 
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*$@%#=_])([-+!*$@%#=_\w]{8,15})$/;

// Paramétrage difficulté de hashage du password
const passwordHashDifficulty = 10;


function emailEncrypt(email) {
  return cryptoJS.AES.encrypt(email,config.emailEncryptKey).toString();
}

function emailDecrypt(emailEncrypted) {
  return cryptoJS.AES.decrypt(emailEncrypted, config.emailEncryptKey).toString(cryptoJS.enc.Utf8);
}

// Fonction de création d'un nouvel user
exports.signup = (req, res, next) => {

  // Validation des entrées utilisateur
  if(! emailRegex.test(req.body.email)){
    return res.status(400).json({ error: "Format de l'email incorrect !" });
  }
  else if(! passwordRegex.test(req.body.password)){
    return res.status(400).json({ error: 'Format du mot de passe incorrect !' });
  }
  else{
    // Auto-génération d'un salt et hashage du password
    bcrypt.hash(config.passwordSaltData + req.body.password, passwordHashDifficulty)
    .then(hash => {
      // Création du nouvel user en BDD
      User.create({
        userName: req.body.userName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        emailEncrypted: emailEncrypt(req.body.email),
        passwordHash: hash,
        isAdmin: false,
      })
      .then((addedUser) => {
        logger.info(`New user signed-up and saved {userId : ${addedUser.id}}`);
        res.status(201).json({ message: 'User created !' });
      })
      .catch(error => {
        if(error instanceof UniqueConstraintError){
          res.status(400).json({ error: "Username not available" });
        } else {
          res.status(400).json({ error: error.message });
        }
      });
    })
    .catch(error => res.status(500).json({ error: error.message }));
    } 
  };

// Fonction d'authentification
  exports.login = (req, res, next) => {
    
    // Recherche de l'user dans la base,
    User.findOne({ where: { userName: req.body.userName } })
    .then(user => {
      if (!user) {
        logger.warning(`Login attempt failed (unkwnown user email)`);
        return res.status(401).json({ error: 'User not found !' });
      }

      // Comparaison du password saisi par l'user avec le password en base
      bcrypt.compare(config.passwordSaltData + req.body.password, user.passwordHash)
        .then(valid => {
          if (!valid) {
            logger.warning(`Login attempt failed (wrong password) {userId : ${user.id}}`);
            return res.status(401).json({ error: 'Incorrect password !' });
          }
          res.status(200).json({
            user : {
              id: user.id,
              userName: user.userName,
              firstName: user.firstName,
              lastName: user.lastName,
              email: emailDecrypt(user.emailEncrypted),
              imageUrl: user.imageUrl,
              isAdmin: user.isAdmin
            },
            token: jwt.sign(
              // Données a encoder dans le token
              {userId: user.id},
              // Secret pour crypter le token
              config.sessionTokenSecret,
              // Délai d'expiration du token
              {expiresIn: config.sessionTokenExpirationDelay}
            )
          });
          logger.info(`Login sucessful {userId : ${user.id}}`);
        })
        .catch(error => res.status(500).json({ error: error.message }));
      })
      .catch(error => res.status(500).json({ error: error.message }));
  };


exports.getOne = (req, res, next) => {
  User.findByPk(req.params.id)
  .then(
    (user) => {
      // Retourner uniquement les informations à afficher
      userLight = {
        id: user.id,
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        email: emailDecrypt(user.emailEncrypted),
        imageUrl: user.imageUrl,
        isAdmin: user.isAdmin
      }
      res.status(200).json(userLight);
    }
  ).catch(
    (error) => { res.status(404).json({error: error.message});}
  );
};

exports.modify = (req, res, next) => {

  const reqUser = req.file ? JSON.parse(req.body.user) : req.body;

  if(! emailRegex.test(reqUser.email)){
    return res.status(400).json({ error: "Format de l'email incorrect !" });
  }

  // Suppression de l'ancienne image si le fichier a été modifié par l'user
  if(req.file){
    User.findByPk(req.params.id)
    .then(user => {
      if (user.imageUrl) {
        // Récuperer l'adresse du fichier lié à l'objet
        const filename = user.imageUrl.split('/images/')[1];
        // Supprimer ce fichier
        fs.unlink(`images/${filename}`,(err => {
          if (err) logger.warning(`Failed to delete file : images/${filename}`);
          else logger.info(`File deleted : ${filename}`);
        }));
      }
    })
    .catch(error => res.status(500).json({ error: error.message }));
  }

  const userObject = req.file ?
  // Si un fichier a été inclus dans la requette (fichier modifié par lutilisateur)
  // Alors on traite l'image
    {
      firstName: reqUser.firstName,
      lastName: reqUser.lastName,
      emailEncrypted: emailEncrypt(reqUser.email),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }
  // sinon ou traite simplement l'objet entrant 
    : {
      firstName: reqUser.firstName,
      lastName: reqUser.lastName,
      emailEncrypted: emailEncrypt(reqUser.email)
    };

  // Ensuite on enregistre l'objet mis à jour
  User.update({ ...userObject}, { where: { id: req.params.id } })
  .then(() => {
    logger.info(`User modified {userId : ${req.params.id}}`);
    res.status(200).json({ message: 'User modified !', imageUrl: userObject.imageUrl});
  })
  .catch(error => res.status(400).json({ error: error.message }));
};


exports.delete = (req, res, next) => {
  // Trouver l'objet à supprimer
  User.findByPk(req.params.id)
  .then(user => {
    if (user.imageUrl) {
      // Récuperer l'adresse du fichier lié à l'objet
      const filename = user.imageUrl.split('/images/')[1];
      // Supprimer ce fichier
      fs.unlink(`images/${filename}`, () => {});
    } 
    User.destroy({ where: { id: req.params.id } })
    .then(() => {
      logger.info(`User deleted {userId : ${req.params.id}}`);
      res.status(200).json({ message: 'User deleted !'});
    })
    .catch(error => res.status(400).json({ error: error.message }));
  })
  .catch(error => res.status(500).json({ error : error.message }));
};
