const Article = require('../database/models/').sequelize.models.Articles;
const User = require('../database/models/').sequelize.models.Users;
const Like = require('../database/models/').sequelize.models.Likes;
const Comment = require('../database/models/').sequelize.models.Comments;

const fs = require('fs');

const logger = require('../logger');

const nbOfItemsInOnePage = 5;


exports.create = (req, res, next) => {

  if(!req.file){
    res.status(400).json({ error: 'File is required' });
  } else{
    Article.create({
      title: req.body.title,
      userId: req.body.userId,
    // Contruire l'url de l'image enregistrée sur le serveur (http://ipserveur/images/nomfichier)
    // Le fichier est fourni par multer dans une propriété file qui a été ajoutée à la requette
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })
    .then((article) => res.status(201).json({ 
      message: 'Article saved !',
      articleId: article.id
    }))
    .catch(error => res.status(400).json({ error: error.message }));
  }
};


exports.modify = (req, res, next) => {

    const articleObject = { title: req.body.title };

    // On enregistre l'objet mis à jour
    Article.update({ ...articleObject}, { where: { id: req.params.id } })
      .then(() => res.status(200).json({ message: 'Article modified !'}))
      .catch(error => res.status(400).json({ error: error.message }));
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
      .catch(error => res.status(400).json({ error: error.message }));
    });
  })
  .catch(error => res.status(500).json({ error: error.message }));
};


async function getLikesCount(articles) {
  try{
    for (article of articles){
      article.likesCount = await Like.count( { where: { articleId: article.id, liked: 1} } );
      article.dislikesCount = await Like.count( { where: { articleId: article.id, liked: -1} } );
    }
    return articles;
  }
  catch (error) {
    res.status(400).json({error: error.message});
  }
}


exports.getAll = (req, res, next) => {
  // Si une page a été demandée en paramètre on le prend en compte sinon on renvoie la première page (0)
  const pageNumber = req.query.page ? parseInt(req.query.page) : 1;

  Article.count()
  .then( numberOfItem => {

    const numberOfPages = Math.ceil(numberOfItem / nbOfItemsInOnePage);

    if (pageNumber < 1 || pageNumber > numberOfPages){
      throw new Error("Page demandée inexistante");
    } else {
      // récupération de la liste des articles, avec les infos sur l'user créateur
      // + les commentaires avec les infos sur l'user auteur du commentaire
      // + le like du user qui fait la requette
      Article.findAll( {
        limit: nbOfItemsInOnePage,
        offset: (pageNumber -1) * nbOfItemsInOnePage,
        order: [['createdAt','DESC']],
        attributes: { exclude: ['userId'] },
        include: [{ 
          model: User,
          as: 'user',
          attributes: ["id", "userName", "imageUrl"]
        },
        { model: Comment,
          as: 'Comments',
          attributes: ["id", "content", "createdAt"],
          order:[[['createdAt','DESC']]],
          include: [{
            model: User,
            as: 'user',
            attributes: ["id", "userName", "imageUrl"]
          }]
        },
        {
          model: Like,
          as: 'Likes',
          where: { userId: req.body.userId},
          attributes: ["liked"],
          required: false
        }]
      }).then(
        (articles) => {
          let articlesLight = JSON.parse(JSON.stringify(articles));
          // Récupération du nombre de like/dislikes de chaque article avant retour au front
          getLikesCount(articlesLight)
          .then( (articlesWithLikesCount) =>
            res.status(200).json({articlesWithLikesCount, pages: numberOfPages})
          ).catch(
            (error) => {console.log(error); res.status(400).json({error: error.message});}
          );
        }
      ).catch(
        (error) => {console.log(error); res.status(400).json({error: error.message});}
      );
    }
  })
  .catch(
    (error) => {console.log(error); res.status(400).json({error: error.message});}
  );
};
