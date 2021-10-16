require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./Models/User');

/////////////CONNECT TO DB////////////////
mongoose.connect(process.env.DB_CONNECTION, ()=>{
    console.log('Conencted to DB');
})

///////////////SWAGGER////////////////////
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'NYCDOT Cloud App API Documentation',
    version: '1.0.0',
  },
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['index.js'],
};

const swaggerSpec = swaggerJSDoc(options);

/////////////Middlewares/////////////////
app.use(cors());
app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//////////////////////////////////////////
app.get('/', function(req, res){
    res.send('Hello World!');
});

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Signup User
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email.
 *     responses:
 *      '200':
 *        description: Successfully Signed Up.
 *      '400':
 *        description: Already Signed Up.
*/

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

/**
 * @swagger
 * /signin:
 *   post:
 *     summary: Signup User
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email.
 *     responses:
 *      '200':
 *        description: Successfully Logged In.
 *      '400':
 *        description: User is not found.
*/

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