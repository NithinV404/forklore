var express = require("express");
var router = express.Router();

router.post('/', async function (req, res) {
    try {
        let url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${req.body.recipeName}`;
        const response = await fetch(url);
        const data = await response.json();
        return res.send(data);
      } catch (error) {
        console.log(error);
      }
})

module.exports = router;