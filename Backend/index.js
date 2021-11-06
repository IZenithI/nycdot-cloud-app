require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./Models/User');
const Data = require('./Models/Data');

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
 *               role:
 *                 type: string
 *                 description: The user's role (admin or intern).
 *     responses:
 *      '200':
 *        description: Successfully Signed Up.
 *      '400':
 *        description: Already Signed Up.
*/

app.post('/signup', async (req, res) => {
    const user = await User.findOne({ 'email': req.body.email.toLowerCase() }).exec();

    if(user){
        res.status(400).send("Already Signed Up");
    }
    else{
        let email = req.body.email.toLowerCase();
        let role = req.body.role.toLowerCase();

        const user = new User({
            email: email,
            role: role
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
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                role:
 *                  type: string
 *                  description: Role of User (admin or intern).
 *      '400':
 *        description: User is not found.
*/

app.post('/signin', async (req, res) => {
    const user = await User.findOne({ 'email': req.body.email.toLowerCase() }).exec();

    if(user){
        res.status(200).send(user.role);
    }
    else{
        res.status(404).send("User is not found");
    }
});

/**
 * @swagger
 * /createEntry:
 *   post:
 *     summary: Create New Data Entry
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               FID:
 *                 type: integer
 *                 description: Entry Unique Identifier
 *               Id:
 *                 type: string
 *                 description: Unique Identifier
 *               Comments:
 *                 type: string
 *                 description: Comments
 *               ImageID:
 *                 type: string
 *                 description: Image ID
 *               ImageDat:
 *                 type: string
 *                 description: Image Date
 *               Link:
 *                 type: string
 *                 description: Link
 *               XY:
 *                 type: string
 *                 description: Coordinates
 *               Section:
 *                 type: string
 *                 description: Section
 *               OnStreet:
 *                 type: string
 *                 description: Street
 *               CrossStreet1:
 *                 type: string
 *                 description: Cross Street
 *               CrossStreet2:
 *                 type: string
 *                 description: Cross Street
 *               PostType:
 *                 type: string
 *                 description: Light Post Type
 *               PedestrianArm:
 *                 type: boolean
 *                 description: Contains Pedestrian Arm
 *               NoArms:
 *                 type: integer
 *                 description: Number of Arms
 *               PostColor:
 *                 type: string
 *                 description: Color of Lamp Post
 *               LuminaireType:
 *                 type: string
 *                 description: Type of Luminaire
 *               TeardropType:
 *                 type: string
 *                 description: Teardrop Type
 *               AttachmentType1:
 *                 type: string
 *                 description: Attachment
 *               AttachmentType2:
 *                 type: string
 *                 description: Attachment
 *               AttachmentType3:
 *                 type: string
 *                 description: Attachment
 *     responses:
 *      '200':
 *        description: Successfully Created.
 *      '400':
 *        description: Id Already Exists.
*/

// app.post('/createEntry', async (req, res) => {

// });

/**
 * @swagger
 * /getSection:
 *   post:
 *     summary: Returns All Data of a Single Section
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Section:
 *                 type: string
 *                 description: Section letter
 *     responses:
 *      '200':
 *        description: Successfully Returned Section Data.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                sectionEntries:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      FID:
 *                        type: integer
 *                        description: Entry Unique Identifier
 *                      Id:
 *                        type: string
 *                        description: Unique Identifier
 *                      Comments:
 *                        type: string
 *                        description: Comments
 *                      ImageID:
 *                        type: string
 *                        description: Image ID
 *                      ImageDat:
 *                        type: string
 *                        description: Image Date
 *                      Link:
 *                        type: string
 *                        description: Link
 *                      XY:
 *                        type: string
 *                        description: Coordinates
 *                      Section:
 *                        type: string
 *                        description: Section
 *                      OnStreet:
 *                        type: string
 *                        description: Street
 *                      CrossStreet1:
 *                        type: string
 *                        description: Cross Street
 *                      CrossStreet2:
 *                        type: string
 *                        description: Cross Street
 *                      PostType:
 *                        type: string
 *                        description: Light Post Type
 *                      PedestrianArm:
 *                        type: boolean
 *                        description: Contains Pedestrian Arm
 *                      NoArms:
 *                        type: integer
 *                        description: Number of Arms
 *                      PostColor:
 *                        type: string
 *                        description: Color of Lamp Post
 *                      LuminaireType:
 *                        type: string
 *                        description: Type of Luminaire
 *                      TeardropType:
 *                        type: string
 *                        description: Teardrop Type
 *                      AttachmentType1:
 *                        type: string
 *                        description: Attachment
 *                      AttachmentType2:
 *                        type: string
 *                        description: Attachment
 *                      AttachmentType3:
 *                        type: string
 *                        description: Attachment
 *      '400':
 *        description: Section Not Found.
*/

// app.post('/getSection', async (req, res) => {

// });

/**
 * @swagger
 * /updateEntry:
 *   put:
 *     summary: Update Data Entry
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               FID:
 *                 type: integer
 *                 description: Entry Unique Identifier
 *               Id:
 *                 type: string
 *                 description: Unique Identifier
 *               Comments:
 *                 type: string
 *                 description: Comments
 *               ImageID:
 *                 type: string
 *                 description: Image ID
 *               ImageDat:
 *                 type: string
 *                 description: Image Date
 *               Link:
 *                 type: string
 *                 description: Link
 *               XY:
 *                 type: string
 *                 description: Coordinates
 *               Section:
 *                 type: string
 *                 description: Section
 *               OnStreet:
 *                 type: string
 *                 description: Street
 *               CrossStreet1:
 *                 type: string
 *                 description: Cross Street
 *               CrossStreet2:
 *                 type: string
 *                 description: Cross Street
 *               PostType:
 *                 type: string
 *                 description: Light Post Type
 *               PedestrianArm:
 *                 type: boolean
 *                 description: Contains Pedestrian Arm
 *               NoArms:
 *                 type: integer
 *                 description: Number of Arms
 *               PostColor:
 *                 type: string
 *                 description: Color of Lamp Post
 *               LuminaireType:
 *                 type: string
 *                 description: Type of Luminaire
 *               TeardropType:
 *                 type: string
 *                 description: Teardrop Type
 *               AttachmentType1:
 *                 type: string
 *                 description: Attachment
 *               AttachmentType2:
 *                 type: string
 *                 description: Attachment
 *               AttachmentType3:
 *                 type: string
 *                 description: Attachment
 *     responses:
 *      '200':
 *        description: Successfully Updated
*/

// app.put('/updateEntry', async (req, res) => {

// });

/**
 * @swagger
 * /deleteEntry:
 *   delete:
 *     summary: Delete Entry
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Id:
 *                 type: string
 *                 description: Entry Id.
 *               role:
 *                 type: string
 *                 description: User's role (admin or intern).
 *     responses:
 *      '200':
 *        description: Successfully Deleted.
 *      '400':
 *        description: Entry Not Found or Not Enough Permissions.
*/

// app.delete('/deleteEntry', async(req, res) => {

// });

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`App is listening on Port ${port}`));