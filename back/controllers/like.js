const Sauce = require('../models/sauce');

const logger = require('../logger');



exports.like = (req, res, next) => {
    // recherche de la sauce
    Sauce.findOne({_id: req.params.id})
    .then(
      (sauce) => {
        // Like et pas déja liké/disliké
        if(req.body.like === 1 && ! sauce.isLiked(req.body.userId) && ! sauce.isDisliked(req.body.userId) ){
          sauce.like(req.body.userId);
          Sauce.updateOne({ _id: sauce._id }, sauce)
          .then(() => res.status(200).json({ message: 'Item liked !'}))
          .catch(error => res.status(400).json({ error }));
        }
        // Dislike et pas déja liké/disliké
        else if(req.body.like === -1 && ! sauce.isLiked(req.body.userId) && ! sauce.isDisliked(req.body.userId) ){
          sauce.dislike(req.body.userId);
          Sauce.updateOne({ _id: sauce._id }, sauce)
          .then(() => res.status(200).json({ message: 'Item disliked !'}))
          .catch(error => res.status(400).json({ error }));
        }
        // Unlike/Undislike et déja liké
        else if(req.body.like === 0 && sauce.isLiked(req.body.userId) ){
          sauce.unLike(req.body.userId);
          Sauce.updateOne({ _id: sauce._id }, sauce)
          .then(() => res.status(200).json({ message: 'Item unliked !'}))
          .catch(error => res.status(400).json({ error }));
        }
        // Unlike/Undislike et déja disliké
        else if(req.body.like === 0 && sauce.isDisliked(req.body.userId) ){
          sauce.unDislike(req.body.userId);
          Sauce.updateOne({ _id: sauce._id }, sauce)
          .then(() => res.status(200).json({ message: 'Item undisliked !'}))
          .catch(error => res.status(400).json({ error }));
        }
        // Autres cas : requette impossible à traiter
        else{
          res.status(400).json({error: "Bad request"});
        }
      }
    ).catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );
};