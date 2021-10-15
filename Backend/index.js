const express = require('express');
const app = express();


app.get('/', function(req, res){
    res.send('Hello World!');
});


const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`App is listening on Port ${port}`));