const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const userCtrl = require('../controllers/user');

router.get('/:id', auth.generalAuth, auth.checkUserOwner, userCtrl.getOne);
router.put('/:id', auth.generalAuth, auth.checkUserOwner, multer, userCtrl.modify);
router.delete('/:id', auth.generalAuth, auth.checkUserOwner, userCtrl.delete);

module.exports = router;