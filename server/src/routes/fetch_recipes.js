var express = require("express");
var router = express.Router();

const { readFileData } = require("./file_utils");


router.get('/', async function (req, res) {
  res.send(await readFileData());
})

module.exports = router;