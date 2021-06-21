const Sauce = require('../models/sauce');
const fs = require('fs');

const logger = require('../logger');

exports.create = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
      ...sauceObject,
    // Contruire l'url de l'image enregistrée sur le serveur (http://ipserveur/images/nomfichier)
    // Le fichier est fourni par multer dans une propriété file qui a été ajoutée à la requette
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
      .then(() => res.status(201).json({ message: 'Item saved !'}))
      .catch(error => res.status(400).json({ error }));
  };


exports.modify = (req, res, next) => {

    // Suppression de l'ancienne image si le fichier a été modifié par l'user
    if(req.file){
      Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        // Récuperer l'adresse du fichier lié à l'objet
        const filename = sauce.imageUrl.split('/images/')[1];
        // Supprimer ce fichier
        fs.unlink(`images/${filename}`,(err => {
          if (err) logger.warning(`Failed to delete file : images/${filename}`);
          else logger.info(`File deleted : ${filename}`);
        }));
      })
      .catch(error => res.status(500).json({ error }));
    }

    const sauceObject = req.file ?
    // Si un fichier a été inclus dans la requette (fichier modifié par lutilisateur)
    // Alors on traite l'image
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      }
    // sinon ou traite simplement l'objet entrant 
      : { ...req.body };

    // Ensuite on enregistre l'objet mis à jour
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Item modified !'}))
      .catch(error => res.status(400).json({ error }));
  };


  exports.delete = (req, res, next) => {
    // Trouver l'objet à supprimer
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        // Récuperer l'adresse du fichier lié à l'objet
        const filename = sauce.imageUrl.split('/images/')[1];
        // Supprimer ce fichier
        fs.unlink(`images/${filename}`, () => {
            // Supprimer l'objet lui-même
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Item deleted !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };


exports.getAll = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};



