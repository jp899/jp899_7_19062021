const Like = require('../database/models/').sequelize.models.Likes;


exports.like = (req, res, next) => {
  // On essaie d'insérer un nouveau like
  Like.create({
    liked: req.body.liked,
    userId: req.body.userId,
    articleId: req.params.articleId
  })
  .then(() => res.status(201).json({ message: 'Like saved !' }))
  .catch(error => {
    // En cas d'erreur car le like existe déja, on essaie d'update la ligne existante
    if (error.name === "SequelizeUniqueConstraintError"){
      Like.update({ liked: req.body.liked }, { where: { id: req.body.userId, articleId: req.params.articleId } })
      .then(() => res.status(200).json({ message: 'Like saved !'}))
      .catch(error => res.status(400).json({ error }));
    } else {
      res.status(400).json({ error });
    }
  });
};