// const User = require('../models/user.js');
const User = require('../database/models/').sequelize.models.Users;

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


// Fonction de création d'un nouvel user
exports.signup = (req, res, next) => {

  console.log(req.body);

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
      // Cryptage de l'email avant stockage en base
      const keyWordArray = cryptoJS.enc.Hex.parse(config.emailEncryptKey);
      // Utilisation mode ECB pour obtenir la même chaine chiffrée à chaque chiffrage pour un même email
      const encryptedEmail = cryptoJS.AES.encrypt(req.body.email,config.emailEncryptKey).toString();

      // Création du nouvel user en BDD
      User.create({
        userName: req.body.userName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        emailEncrypted: encryptedEmail,
        passwordHash: hash,
      })
      .then((addedUser) => {
        logger.info(`New user signed-up and saved {userId : ${addedUser.id}}`);
        res.status(201).json({ message: 'User created !' });
      })
      .catch(error => res.status(400).json({ error: error }));
    })
    .catch(error => res.status(500).json({ error }));
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
            userId: user.id,
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
        .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };


exports.getOne = (req, res, next) => {
  User.findOne({ where: { id: req.params.id } })
  .then(
    (user) => {
      // Retourner uniquement les informations à afficher
      userLight = {
        id: user.id,
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        email: cryptoJS.AES.decrypt(user.emailEncrypted, config.emailEncryptKey).toString(cryptoJS.enc.Utf8)
      }
      res.status(200).json(userLight);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modify = (req, res, next) => {

    // Suppression de l'ancienne image si le fichier a été modifié par l'user
    if(req.file){
      User.findOne({ _id: req.params.id })
      .then(user => {
        // Récuperer l'adresse du fichier lié à l'objet
        const filename = user.imageUrl.split('/images/')[1];
        // Supprimer ce fichier
        fs.unlink(`images/${filename}`,(err => {
          if (err) logger.warning(`Failed to delete file : images/${filename}`);
          else logger.info(`File deleted : ${filename}`);
        }));
      })
      .catch(error => res.status(500).json({ error }));
    }

    const userObject = req.file ?
    // Si un fichier a été inclus dans la requette (fichier modifié par lutilisateur)
    // Alors on traite l'image
      {
        ...JSON.parse(req.body.user),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      }
    // sinon ou traite simplement l'objet entrant 
      : { ...req.body };

    // Ensuite on enregistre l'objet mis à jour
    User.updateOne({ _id: req.params.id }, { ...userObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Item modified !'}))
      .catch(error => res.status(400).json({ error }));
  };


  exports.delete = (req, res, next) => {
    // Trouver l'objet à supprimer
    User.findOne({ _id: req.params.id })
      .then(user => {
        // Récuperer l'adresse du fichier lié à l'objet
        const filename = user.imageUrl.split('/images/')[1];
        // Supprimer ce fichier
        fs.unlink(`images/${filename}`, () => {
            // Supprimer l'objet lui-même
          User.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Item deleted !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };