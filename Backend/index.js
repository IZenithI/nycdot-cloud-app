require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./Models/User');

/////////////Middlewares/////////////////
app.use(cors());
app.use(express.json());

/////////////CONNECT TO DB////////////////
mongoose.connect(process.env.DB_CONNECTION, ()=>{
    console.log('Conencted to DB');
})

/////////////////////////////////////////////
app.get('/', function(req, res){
    res.send('Hello World!');
});

app.post('/signup', async (req, res) => {
    const user = await User.findOne({ 'email': req.body.email }).exec();

    if(user){
        res.status(400).send("Already Signed Up");
    }
    else{
        let email = req.body.email;

        const user = new User({
            email: email
        })
        
        const savedUser = await user.save();

        res.status(200).send(savedUser.email + " Successfully Signed Up");
    }
});

app.post('/signin', async (req, res) => {
    const user = await User.findOne({ 'email': req.body.email }).exec();

    if(user){
        res.status(200).send("Success");
    }
    else{
        res.status(404).send("User is not found");
    }
});


const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`App is listening on Port ${port}`));