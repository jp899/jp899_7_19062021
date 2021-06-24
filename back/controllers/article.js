const Article = require('../database/models/').sequelize.models.Articles;
const fs = require('fs');

const logger = require('../logger');


exports.create = (req, res, next) => {
    Article.create({
      title: req.body.article.title,
      userId: req.body.userId,
    // Contruire l'url de l'image enregistrée sur le serveur (http://ipserveur/images/nomfichier)
    // Le fichier est fourni par multer dans une propriété file qui a été ajoutée à la requette
      imageUrl: `${req.protocol}://${req.get('host')}/images/`
    })
    .then((article) => res.status(201).json({ 
      message: 'Article saved !',
      articleId: article.id
    }))
    .catch(error => res.status(400).json({ error }));
  };


exports.modify = (req, res, next) => {

    // Suppression de l'ancienne image si le fichier a été modifié par l'user
    if(req.file){
      Article.findByPk(req.params.id)
      .then(article => {
        // Récuperer l'adresse du fichier lié à l'objet
        const filename = article.imageUrl.split('/images/')[1];
        // Supprimer ce fichier
        fs.unlink(`images/${filename}`,(err => {
          if (err) logger.warning(`Failed to delete file : images/${filename}`);
          else logger.info(`File deleted : ${filename}`);
        }));
      })
      .catch(error => res.status(500).json({ error }));
    }

    const articleObject = req.file ?
    // Si un fichier a été inclus dans la requette (fichier modifié par lutilisateur)
    // Alors on traite l'image
      {
        title: req.body.article.title,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      }
    // sinon ou traite simplement l'objet entrant 
      : { title: req.body.article.title };

    // Ensuite on enregistre l'objet mis à jour
    Article.update({ ...articleObject}, { where: { id: req.params.id } })
      .then(() => res.status(200).json({ message: 'Article modified !'}))
      .catch(error => res.status(400).json({ error }));
  };


exports.delete = (req, res, next) => {
  // Trouver l'objet à supprimer
  Article.findByPk(req.params.id)
    .then(article => {
      // Récuperer l'adresse du fichier lié à l'objet
      const filename = article.imageUrl.split('/images/')[1];
      // Supprimer ce fichier
      fs.unlink(`images/${filename}`, () => {
          // Supprimer l'objet lui-même
      Article.destroy({ where: { id: req.params.id } })
      .then(() => res.status(200).json({ message: 'Article deleted !'}))
      .catch(error => res.status(400).json({ error }));
    });
  })
  .catch(error => res.status(500).json({ error }));
};


exports.getAll = (req, res, next) => {
  Article.findAll().then(
    (articles) => {
      res.status(200).json(articles);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );

};
