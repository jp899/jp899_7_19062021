const Comment = require('../database/models/').sequelize.models.Comments;

const logger = require('../logger');


exports.create = (req, res, next) => {
  Comment.create({
    content: req.body.comment.content,
    userId: req.body.userId,
    articleId: req.params.articleId
  })
  .then((comment) => res.status(201).json({ 
    message: 'Comment saved !',
    commentId: comment.id
  }))
  .catch(error => res.status(400).json({ error }));
};


exports.modify = (req, res, next) => {
  Comment.update({ content: req.body.comment.content }, { where: { id: req.params.id } })
    .then(() => res.status(200).json({ message: 'Comment modified !'}))
    .catch(error => res.status(400).json({ error }));
};


exports.delete = (req, res, next) => {
  Comment.destroy({ where: { id: req.params.id } })
  .then(() => res.status(200).json({ message: 'Comment deleted !'}))
  .catch(error => res.status(400).json({ error }));
};