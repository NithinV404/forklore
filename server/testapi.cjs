const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.listen(5000, () => console.log('listening at 5000'));
app.use(express.json());

app.post('/search', (req, res) => {
    const mealname = req.body.recipeName;
    try
    {
        let url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealname}`;
        fetch(url)
        .then(response=>response.json())
        .then(data=>res.send(data));
    }
    catch(error)    
    {
        console.log(error);
    }
});



