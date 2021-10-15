require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');

/////////////CONNECT TO DB////////////////
mongoose.connect(process.env.DB_CONNECTION, ()=>{
    console.log('Conencted to DB');
})

app.use(express.json());

const User = require('./Models/User');

/////////////////////////////////////////////
app.get('/', function(req, res){
    res.send('Hello World!');
});

app.post('/signup', (req, res) => {
    let email = req.body.email;

    const user = new User({
        email: email
    })
    
    user.save();

    res.status(200).send(email + " Successfully Signed Up");
});


const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`App is listening on Port ${port}`));