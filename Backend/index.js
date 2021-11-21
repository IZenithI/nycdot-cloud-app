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
    let email = req.body.email.toLowerCase();
    let role = req.body.role.toLowerCase();

    let getResponse = await sheets.spreadsheets.values.get({auth: jwtClient, spreadsheetId: spreadsheetId, range: 'Users'})
    let values = getResponse.data.values;

    let foundEmail = false;

    for(let row of values){
        if(row[0] == email){
            foundEmail = true;
            break;
        }
    }

    if(foundEmail){
        res.status(400).send("Already Signed Up");
    }
    else{
        let values = [
            [
                email,
                role
            ]
        ]
        const sheetEntry = {values};
        await sheets.spreadsheets.values.append({
            auth: jwtClient,
            spreadsheetId: spreadsheetId,
            range: 'Users',
            valueInputOption: "RAW",
            resource: sheetEntry
        });
        res.status(200).send("Successfully Signed Up");
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
    let email = req.body.email.toLowerCase();

    let getResponse = await sheets.spreadsheets.values.get({auth: jwtClient, spreadsheetId: spreadsheetId, range: 'Users'})
    let values = getResponse.data.values;

    for(let row of values){
        if(row[0] == email){
            res.status(200).send(row[1]);
            return;
        }
    }

    res.status(400).send("User is not found");
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
    let senderEmail = req.body.senderEmail.toLowerCase();
    let targetEmail = req.body.targetEmail.toLowerCase();
    let task = req.body.task;

    let getResponse = await sheets.spreadsheets.values.get({auth: jwtClient, spreadsheetId: spreadsheetId, range: 'Tasks'});
    let values = getResponse.data.values;
    
    let hasTask = false;
    for(let i = 0; i < values.length; i++){
        let row = values[i];
        if(row[0] == targetEmail){
            if(row[2] == null){
                let values = [
                    [
                        targetEmail,
                        senderEmail,
                        task
                    ]
                ]
                const sheetEntry = {values};
                await sheets.spreadsheets.values.update({
                    auth: jwtClient,
                    spreadsheetId: spreadsheetId,
                    range: 'Tasks!A'+(i+1),
                    valueInputOption: "RAW",
                    resource: sheetEntry
                });
        
                res.status(200).send("Assigned Successfully");
                return;
            }
            break;
        }
    }

    res.status(400).send("Already has a task.");
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
    let targetEmail = req.body.targetEmail;

    let getResponse = await sheets.spreadsheets.values.get({auth: jwtClient, spreadsheetId: spreadsheetId, range: 'Tasks'});
    let values = getResponse.data.values;
    
    for(let row of values){
        if(row[0] == targetEmail){
            res.status(200).send(row[2]);
            return;
        }
    }

    res.status(400).send("User does not have a task.");
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
 *        description: Successfully Completed.
 *      '400':
 *        description: User does not have a task.
*/
}

app.post('/completeTask', async(req, res) => {
    let targetEmail = req.body.targetEmail;

    let getResponse = await sheets.spreadsheets.values.get({auth: jwtClient, spreadsheetId: spreadsheetId, range: 'Tasks'});
    let values = getResponse.data.values;
    
    for(let i = 1; i < values.length; i++){
        let row = values[i];
        if(row[0] == targetEmail){
            if(row[2] != null){
                await sheets.spreadsheets.values.clear({
                    auth: jwtClient,
                    spreadsheetId: spreadsheetId,
                    range: 'Tasks!C'+(i+1),
                });

                res.status(200).send("Successfully Completed");
                return;
            }
            break;
        }
    }

    res.status(400).send("User does not have a task.");
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
    let getResponse = await sheets.spreadsheets.values.get({auth: jwtClient, spreadsheetId: spreadsheetId, range: 'Tasks'});
    let values = getResponse.data.values;

    let internTasks = [];
    for(let i = 1; i < values.length; i++){
        let row = values[i];
        let internInfo = {
            'internEmail': row[0]
        }

        if(row[2] != null){
            internInfo.task = row[2];
        }
        else{
            internInfo.task = "";
        }
        internTasks.push(internInfo);
    }
    if(internTasks.length > 0){
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
        let getResponse = await sheets.spreadsheets.values.get({auth: jwtClient, spreadsheetId: spreadsheetId, range: 'Data'})
        let values = getResponse.data.values;
    
        let foundEntry = false;
    
        for(let row of values){
            if(row[1] == req.body.Id){
                foundEntry = true;
            }
        }
    
        if(foundEntry){
            res.status(400).send("Entry Already Exists");
        }
        else{
            let values = [
                [
                    req.body.FID,
                    req.body.Id,
                    req.body.Comments,
                    req.body.ImageID,
                    req.body.ImageDat,
                    req.body.Link,
                    req.body.XY,
                    req.body.Section,
                    req.body.OnStreet,
                    req.body.CrossStreet1,
                    req.body.CrossStreet2,
                    req.body.PostType,
                    req.body.PedestrianArm,
                    req.body.NoArms,
                    req.body.PostColor,
                    req.body.LuminaireType,
                    req.body.TeardropType,
                    req.body.AttachmentType1,
                    req.body.AttachmentType2,
                    req.body.AttachmentType3
                ]
            ]
            const sheetEntry = {values};
            await sheets.spreadsheets.values.append({
                auth: jwtClient,
                spreadsheetId: spreadsheetId,
                range: 'Data',
                valueInputOption: "RAW",
                resource: sheetEntry
            });
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
        let getResponse = await sheets.spreadsheets.values.get({auth: jwtClient, spreadsheetId: spreadsheetId, range: 'Data'});
        let values = getResponse.data.values;
    
        let sectionEntries = [];
        for(let i = 1; i < values.length; i++){
            let row = values[i];
            if(row[7] == req.body.Section){
                let entry = {
                    FID: row[0],
                    Id: row[1],
                    Comments: row[2],
                    ImageID: row[3],
                    ImageDat: row[4],
                    Link: row[5],
                    XY: row[6],
                    Section: row[7],
                    OnStreet: row[8],
                    CrossStreet1: row[9],
                    CrossStreet2: row[10],
                    PostType: row[11],
                    PedestrianArm: row[12],
                    NoArms: row[13],
                    PostColor: row[14],
                    LuminaireType: row[15],
                    TeardropType: row[16],
                    AttachmentType1: row[17],
                    AttachmentType2: row[18],
                    AttachmentType3: row[19]
                }
                sectionEntries.push(entry);
            }
        }
    
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
        let getResponse = await sheets.spreadsheets.values.get({auth: jwtClient, spreadsheetId: spreadsheetId, range: 'Data'});
        let values = getResponse.data.values;
    
        for(let i = 0; i < values.length; i++){
            if(row[1] == req.body.Id){
                let values = [
                    [
                        req.body.FID,
                        req.body.Id,
                        req.body.Comments,
                        req.body.ImageID,
                        req.body.ImageDat,
                        req.body.Link,
                        req.body.XY,
                        req.body.Section,
                        req.body.OnStreet,
                        req.body.CrossStreet1,
                        req.body.CrossStreet2,
                        req.body.PostType,
                        req.body.PedestrianArm,
                        req.body.NoArms,
                        req.body.PostColor,
                        req.body.LuminaireType,
                        req.body.TeardropType,
                        req.body.AttachmentType1,
                        req.body.AttachmentType2,
                        req.body.AttachmentType3
                    ]
                ]
                const sheetEntry = {values};
                await sheets.spreadsheets.values.update({
                    auth: jwtClient,
                    spreadsheetId: spreadsheetId,
                    range: 'Data!A'+(i+1),
                    valueInputOption: "RAW",
                    resource: sheetEntry
                });
                res.status(200).send("SuccessfullyUpdated");
                return;
            }
        }
    
        res.status(400).send("Data Does Not Exist");    
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
        if(req.body.role == "admin"){
            let getResponse = await sheets.spreadsheets.values.get({auth: jwtClient, spreadsheetId: spreadsheetId, range: 'Data'});
            let values = getResponse.data.values;
    
            for(let i = 1; i < values.length; i++){
                let row = values[i];
                if(row[1] == req.body.Id){
                    sheets.spreadsheets.batchUpdate({
                        auth: jwtClient,
                        spreadsheetId: spreadsheetId,
                        resource:{
                            requests: [
                                {
                                    deleteDimension:{
                                        range:{
                                            sheetId: "1764316489",
                                            dimension: "ROWS",
                                            startIndex: i,
                                            endIndex: i+1
                                        }
                                    }
                                }
                            ]
                        }
                    })
                    res.status(200).send("Successfully Deleted");
                    return;
                }
            }
            res.status(400).send("Entry Does Not Exist");
        }
        else{
            res.status(401).send("Invalid Permission");
        }
    });

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`App is listening on Port ${port}`));