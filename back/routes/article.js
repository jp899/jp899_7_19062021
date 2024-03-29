
// Fichier qui aiguille les requettes en fonction de leur type et url
// vers les traitements fonctionnels correspondants (fichier controller/article.js)

const express = require('express');
const router = express.Router();

const articleCtrl = require('../controllers/article');
const commentCtrl = require('../controllers/comment');
const likeCtrl = require('../controllers/like');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// On applique à chaque route d'abord le middleware pour controler l'authentification,
// puis si necessaire le middleware pour ajouter un objet FILE à la requette avec le fichier fourni par le front
// et enfin le middleware "fonctionnel"

router.get('/', auth.generalAuth, auth.getUserIdFromToken, articleCtrl.getAll);
router.post('/', auth.generalAuth, multer, auth.getUserIdFromToken, articleCtrl.create);
router.put('/:id', auth.generalAuth, auth.checkArticleOwner, multer, articleCtrl.modify);
router.delete('/:id', auth.generalAuth, auth.checkArticleOwner, articleCtrl.delete);

router.get('/:articleId/like', auth.generalAuth, likeCtrl.getLikesCount);
router.post('/:articleId/like', auth.generalAuth, likeCtrl.like);

router.post('/:articleId/comment', auth.generalAuth, commentCtrl.create)
router.put('/:articleId/comment/:id', auth.generalAuth, auth.checkCommentOwner, commentCtrl.modify)
router.delete('/:articleId/comment/:id', auth.generalAuth, auth.checkCommentOwner, commentCtrl.delete)

module.exports = router;