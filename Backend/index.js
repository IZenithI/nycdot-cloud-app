require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./Models/User');
const Data = require('./Models/Data');
const Task = require('./Models/Task');

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

/////////CONNECT GOOGLE SHEETS DB/////////

const {google} = require('googleapis');
const secretKey = JSON.parse(process.env.SECRET_KEY);
const jwtClient = new google.auth.JWT(
    secretKey.client_email,
    null,
    secretKey.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);

jwtClient.authorize(function (err, tokens) {
    if(err) {
        console.log(err);
        return;
    } else {
        console.log("Successfully connected!");
    }
});

const spreadsheetId = process.env.SPREADSHEET_ID;
const sheets = google.sheets('v4');

////////////////////////////////////////////////////

{
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
}

app.post('/signup', async (req, res) => {
    const user = await User.findOne({ 'email': req.body.email.toLowerCase() }).exec();

    if(user){
        res.status(400).send("Already Signed Up");
    }
    else{
        let email = req.body.email.toLowerCase();
        let role = req.body.role.toLowerCase();

        const newUser = new User({
            email: email,
            role: role
        });
        
        const savedUser = await newUser.save();

        res.status(200).send(savedUser.email + " Successfully Signed Up");
    }
});

{
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
}

app.post('/signin', async (req, res) => {
    const user = await User.findOne({ 'email': req.body.email.toLowerCase() }).exec();

    if(user){
        res.status(200).send(user.role);
    }
    else{
        res.status(404).send("User is not found");
    }
});

{
/**
 * @swagger
 * /getInterns:
 *   get:
 *     summary: Returns List of Intern with Tasks
 *     responses:
 *      '200':
 *        description: Successfully Returned Intern Accounts.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                internTasks:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      internEmail:
 *                        type: string
 *                        description: Intern Email
 *                      task:
 *                        type: string
 *                        description: Intern Task
 *      '400':
 *        description: There are No Existing Interns.
*/
}

app.get('/getInterns', async (req, res) => {
    const interns = await User.find({ 'role': 'intern' }).exec();
    
    if(interns.length > 0){
        let internTasks = [];
        for(let i = 0; i < interns.length; i++){
            const internEmail = interns[i].email;
            const task = await Task.findOne({ 'targetEmail': internEmail }).exec();
            let internInfo = {
                'internEmail': internEmail
            };
            if(task){
                internInfo.task = task.task;
            }
            else{
                internInfo.task = "";
            }
            internTasks.push(internInfo);
        }
        res.status(200).send(internTasks);
    }
    else{
        res.status(400).send("There Are No Existing Interns");
    }

});

{
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
 *                 type: string
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
}

app.post('/createEntry', async (req, res) => {
    const data = await Data.findOne({ 'Id': req.body.Id }).exec();

    if(data){
        res.status(400).send("Entry Already Exists");
    }
    else{
        const newData = new Data({
            FID: req.body.FID,
            Id: req.body.Id,
            Comments: req.body.Comments,
            ImageID: req.body.ImageID,
            ImageDat: req.body.ImageDat,
            Link: req.body.Link,
            XY: req.body.XY,
            Section: req.body.Section,
            OnStreet: req.body.OnStreet,
            CrossStreet1: req.body.CrossStreet1,
            CrossStreet2: req.body.CrossStreet2,
            PostType: req.body.PostType,
            PedestrianArm: req.body.PedestrianArm,
            NoArms: req.body.NoArms,
            PostColor: req.body.PostColor,
            LuminaireType: req.body.LuminaireType,
            TeardropType: req.body.TeardropType,
            AttachmentType1: req.body.AttachmentType1,
            AttachmentType2: req.body.AttachmentType2,
            AttachmentType3: req.body.AttachmentType3
        });

        const newSavedData = await newData.save();

        res.status(200).send("Created Successfully");
    }
});

{
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
 *                        type: string
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
}

app.post('/getSection', async (req, res) => {
    const sectionEntries = await Data.find({ 'Section': req.body.Section }).exec();
    
    if(sectionEntries.length > 0){
        res.status(200).send(sectionEntries);
    }
    else{
        res.status(400).send("Section Not Found");
    }

});

{
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
 *                 type: string
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
 *        description: Successfully Updated.
 *      '400':
 *        description: Data Does Not Exist.
*/
}

app.put('/updateEntry', async (req, res) => {
    const dataToUpdate = await Data.findOne({ 'Id': req.body.Id }).exec();

    if(dataToUpdate){
        dataToUpdate.FID = req.body.FID;
        dataToUpdate.Id = req.body.Id;
        dataToUpdate.Comments = req.body.Comments;
        dataToUpdate.ImageID = req.body.ImageID;
        dataToUpdate.ImageDat = req.body.ImageDat;
        dataToUpdate.Link = req.body.Link;
        dataToUpdate.XY = req.body.XY;
        dataToUpdate.Section = req.body.Section;
        dataToUpdate.OnStreet = req.body.OnStreet;
        dataToUpdate.CrossStreet1 = req.body.CrossStreet1;
        dataToUpdate.CrossStreet2 = req.body.CrossStreet2;
        dataToUpdate.PostType = req.body.PostType;
        dataToUpdate.PedestrianArm = req.body.PedestrianArm;
        dataToUpdate.NoArms = req.body.NoArms;
        dataToUpdate.PostColor = req.body.PostColor;
        dataToUpdate.LuminaireType = req.body.LuminaireType;
        dataToUpdate.TeardropType = req.body.TeardropType;
        dataToUpdate.AttachmentType1 = req.body.AttachmentType1;
        dataToUpdate.AttachmentType2 = req.body.AttachmentType2;
        dataToUpdate.AttachmentType3 = req.body.AttachmentType3;

        await dataToUpdate.save();

        res.status(200).send("Successfully Updated")
    }
    else{
        res.status(400).send("Data Does Not Exist")
    }
    
});

{
/**
 * @swagger
 * /deleteEntry:
 *   post:
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
 *        description: Entry Does Not Exist.
 *      '401':
 *        description: Invalid Permission.
*/
}

app.post('/deleteEntry', async(req, res) => {
    console.log("role: " + req.body.role);
    console.log("Id: " + req.body.Id);
    if(req.body.role == "admin"){
        const data = await Data.find({ 'Id': req.body.Id }).exec();
        console.log(data);
        if(data){
            await Data.deleteOne({ 'Id': req.body.Id });

            res.status(200).send("Successfully Deleted");
        }
        else{
            res.status(400).send("Entry Does Not Exist");
        }
    }
    else{
        res.status(401).send("Invalid Permission");
    }
});

{
/**
 * @swagger
 * /assignTask:
 *   post:
 *     summary: Task Assignment
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               senderEmail:
 *                 type: string
 *                 description: Email of sender of task.
 *               targetEmail:
 *                 type: string
 *                 description: Email to assign task to.
 *               task:
 *                 type: string
 *                 description: Task to assign to user.
 *     responses:
 *      '200':
 *        description: Successfully Assigned.
 *      '400':
 *        description: Already has a task.
 *      '401':
 *        description: Invalid Permission.
*/
}

app.post('/assignTask', async(req, res) => {
    const task = await Task.findOne({ 'targetEmail': req.body.targetEmail.toLowerCase() }).exec();

    if(task){
        res.status(400).send("Already has a task.");
    }
    else{
        let senderEmail = req.body.senderEmail.toLowerCase();
        let targetEmail = req.body.targetEmail.toLowerCase();
        let task = req.body.task;

        // const sender = await User.findOne({ 'email': senderEmail }).exec();

        // if(sender.role == 'admin'){
        //     const newTask = new Task({
        //         senderEmail: senderEmail,
        //         targetEmail: targetEmail,
        //         task: task
        //     });
            
        //     await newTask.save();

        //     res.status(200).send("Assigned Successfully");
        // }
        // else{
        //     res.status(401).send("Invalid Permission");
        // }
        const newTask = new Task({
            senderEmail: senderEmail,
            targetEmail: targetEmail,
            task: task
        });
        
        await newTask.save();

        res.status(200).send("Assigned Successfully");
    }
});

{
/**
 * @swagger
 * /getTask:
 *   post:
 *     summary: Get Task
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               targetEmail:
 *                 type: string
 *                 description: Email of user.
 *     responses:
 *      '200':
 *        description: Successfully Retrieved.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                task:
 *                  type: string
 *                  description: Assigned Task.
 *      '400':
 *        description: User does not have a task.
*/
}

app.post('/getTask', async(req, res) => {
    const task = await Task.findOne({ 'targetEmail': req.body.targetEmail.toLowerCase() }).exec();
    
    if(task){
        res.status(200).send(task.task);
    }
    else{
        res.status(400).send("User does not have a task.");
    }
});

{
/**
 * @swagger
 * /completeTask:
 *   post:
 *     summary: Complete Task
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               targetEmail:
 *                 type: string
 *                 description: User email for task to delete.
 *     responses:
 *      '200':
 *        description: Successfully Deleted.
 *      '400':
 *        description: User does not have a task.
*/
}

app.post('/completeTask', async(req, res) => {
    const task = await Task.findOne({ 'targetEmail': req.body.targetEmail.toLowerCase() }).exec();

    if(task){
        await Task.deleteOne({ 'targetEmail': req.body.targetEmail });
        res.status(200).send("Successfully Deleted");
    }
    else{
        res.status(400).send("User does not have a task.");
    }
});

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`App is listening on Port ${port}`));