const express = require('express');
const { Info, InfoController } = require('../../controllers');

const router = express.Router();

router.get('/info', InfoController.info);

module.exports = router;
