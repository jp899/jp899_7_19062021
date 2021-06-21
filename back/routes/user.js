const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const userCtrl = require('../controllers/user');

router.get('/:id', auth.generalAuth, auth.ownerAuth, userCtrl.getOne);
router.put('/:id', auth.generalAuth, auth.ownerAuth, multer, userCtrl.update);
router.delete('/:id', auth.generalAuth, auth.ownerAuth, userCtrl.delete);

module.exports = router;