const express = require('express');

const router = express.Router();

/* GET home page. */
// eslint-disable-next-line no-unused-vars
router.get('/', (req, res, _next) => {
  res.send('Clube de Incentivo API');
});

module.exports = router;
