require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cors = require('cors');
const randString = require('randomstring');
const User = require('./Models/User');
const Data = require('./Models/Data');
const Task = require('./Models/Task');

///////////////SWAGGER DOCUMENTATION/////////////////
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
const jwtClient = new google.auth.JWT(
    process.env.SECRET_CLIENT_EMAIL,
    null,
    JSON.parse(process.env.SECRET_PRIVATE_KEY).private_key,
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

const dataSheet = process.env.DATASHEET; //Name of Current Data Sheet Being Changed

///////////////////Email Setup////////////////////////
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls:{
        rejectUnauthorized: false
    }
})

///////////////////////////////////////////////////

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

async function sendPasswordEmail(email, password){
    await transporter.sendMail({
        from: '"No Reply NYCDOT" <noreplynycdot@gmail.com>',
        to: email,
        subject: "Account Password",
        text: "Your password is " + password
    })
}

app.post('/signup', async (req, res) => {
    let email = req.body.email.toLowerCase();
    let role = req.body.role.toLowerCase();

    let getResponse = await sheets.spreadsheets.values.get({auth: jwtClient, spreadsheetId: spreadsheetId, range: 'Users'}) //Get values in 'Users' sheet
    let values = getResponse.data.values;

    let foundEmail = false;

    for(let row of values){ //Find Email
        if(row[0] == email){
            foundEmail = true;
            break;
        }
    }

    if(foundEmail){
        res.status(400).send("Already Signed Up");
    }
    else{
        let password = randString.generate(8);
        sendPasswordEmail(email, password);
        let values = [
            [
                email,
                password,
                role
            ]
        ]
        const sheetEntry = {values};
        await sheets.spreadsheets.values.append({   //Append New User's Info to 'Users' sheet
            auth: jwtClient,
            spreadsheetId: spreadsheetId,
            range: 'Users',
            valueInputOption: "RAW",
            resource: sheetEntry
        });

        values = [
            [
                email
            ]
        ]

        await sheets.spreadsheets.values.append({   //Append Task Row for New User to 'Tasks' sheet
            auth: jwtClient,
            spreadsheetId: spreadsheetId,
            range: 'Tasks',
            valueInputOption: "RAW",
            resource: {values}
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
 *               password:
 *                 type: string
 *                 description: The user's password.
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
 *      '401':
 *        description: Incorrect Password.
*/
}

app.post('/signin', async (req, res) => {
    let email = req.body.email.toLowerCase();
    let password = req.body.password;

    let getResponse = await sheets.spreadsheets.values.get({auth: jwtClient, spreadsheetId: spreadsheetId, range: 'Users'}) //Get Values in 'Users' sheet
    let values = getResponse.data.values;

    for(let row of values){                                 //Find if User Exists and Password Matches
        if(row[0] == email && row[1] == password){
            res.status(200).send(row[2]);
            return;
        }
        else if(row[0] == email){
            res.status(401).send("Incorrect Password.");
            return;
        }
    }

    res.status(400).send("User is not found");
});

{
/**
 * @swagger
 * /changePassword:
 *   post:
 *     summary: Change Password
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email.
 *               currentPassword:
 *                 type: string
 *                 description: The user's current password.
 *               newPassword:
 *                 type: string
 *                 description: The user's new password.
 *               confirmPassword:
 *                 type: string
 *                 description: Confirm new password.
 *     responses:
 *      '200':
 *        description: Successfully Changed Password.
 *      '400':
 *        description: New Password Does Not Match.
 *      '401':
 *        description: Incorrect Password.
*/
}

app.post('/changePassword', async (req, res) => {
    let email = req.body.email.toLowerCase();
    let currentPassword = req.body.currentPassword;
    let newPassword = req.body.newPassword;
    let confirmPassword = req.body.confirmPassword;

    let getResponse = await sheets.spreadsheets.values.get({auth: jwtClient, spreadsheetId: spreadsheetId, range: 'Users'}) //Get Values in 'Users' sheet
    let values = getResponse.data.values;

    for(let i = 0; i < values.length; i++){                 //Find User
        let row = values[i];
        if(row[0] == email && row[1] == currentPassword){
            if(newPassword == confirmPassword){
                let values = [
                    [
                        email,
                        newPassword
                    ]
                ]
                const sheetEntry = {values};

                await sheets.spreadsheets.values.update({   //Update Entry with New Password
                    auth: jwtClient,
                    spreadsheetId: spreadsheetId,
                    range: 'Users!A'+(i+1),
                    valueInputOption: "RAW",
                    resource: sheetEntry
                });

                res.status(200).send("Successfully Changed Password");
            }
            else{
                res.status(400).send("New Password Does Not Match.")
            }
        }
        else if(row[0] == email){
            res.status(401).send("Incorrect Password.");
        }
    }
})

{
/**
 * @swagger
 * /forgotPassword:
 *   post:
 *     summary: Change Password
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
 *        description: Successfully Sent Temporary Password.
 *      '400':
 *        description: Email Does Not Exist.
*/
}

app.post('/forgotPassword', async (req, res) => {
    let email = req.body.email.toLowerCase();

    let getResponse = await sheets.spreadsheets.values.get({auth: jwtClient, spreadsheetId: spreadsheetId, range: 'Users'}) //Get Values in 'Users' sheet
    let values = getResponse.data.values;

    for(let i = 0; i < values.length; i++){             //Find User
        let row = values[i];
        if(row[0] == email){
            let password = randString.generate(8);
            sendPasswordEmail(email, password);
            let values = [
                [
                    email,
                    password
                ]
            ]
            const sheetEntry = {values};

            await sheets.spreadsheets.values.update({       //Update User info with New Password
                auth: jwtClient,
                spreadsheetId: spreadsheetId,
                range: 'Users!A'+(i+1),
                valueInputOption: "RAW",
                resource: sheetEntry
            });

            res.status(200).send("Successfully Sent Temporary Password");
            return;
        }
    }
    res.status(400).send("Email Does Not Exist");
})

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

async function sendAssignEmail(targetEmail, senderEmail, task){             //Send Email when Task is assigned
    await transporter.sendMail({
        from: '"No Reply NYCDOT" <noreplynycdot@gmail.com>',
        to: targetEmail,
        subject: "You have been assigned a new section",
        text: senderEmail + " has assigned you section " + task
    })
}

app.post('/assignTask', async(req, res) => {
    let senderEmail = req.body.senderEmail.toLowerCase();
    let targetEmail = req.body.targetEmail.toLowerCase();
    let task = req.body.task;

    let getResponse = await sheets.spreadsheets.values.get({auth: jwtClient, spreadsheetId: spreadsheetId, range: 'Tasks'});    //Get Values in 'Tasks' sheet
    let values = getResponse.data.values;
    
    for(let i = 0; i < values.length; i++){         //Find Assignee
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
                await sheets.spreadsheets.values.update({       //Update Assignee Task
                    auth: jwtClient,
                    spreadsheetId: spreadsheetId,
                    range: 'Tasks!A'+(i+1),
                    valueInputOption: "RAW",
                    resource: sheetEntry
                });

                sendAssignEmail(targetEmail, senderEmail, task);

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

    let getResponse = await sheets.spreadsheets.values.get({auth: jwtClient, spreadsheetId: spreadsheetId, range: 'Tasks'}); //Get Values in 'Tasks' sheet
    let values = getResponse.data.values;
    
    for(let row of values){                 //Find and Return Users Task
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

async function sendTaskCompleteEmail(internEmail, adminEmail, task){           //Send Email when Task is Completed
    await transporter.sendMail({
        from: '"No Reply NYCDOT" <noreplynycdot@gmail.com>',
        to: adminEmail,
        subject: "Intern has completed a section",
        text: internEmail + " has completed section " + task
    })
}

app.post('/completeTask', async(req, res) => {
    let targetEmail = req.body.targetEmail;

    let getResponse = await sheets.spreadsheets.values.get({auth: jwtClient, spreadsheetId: spreadsheetId, range: 'Tasks'});    //Get Values in 'Tasks' sheet
    let values = getResponse.data.values;
    
    for(let i = 1; i < values.length; i++){                 //Find User with Task Completed
        let row = values[i];
        if(row[0] == targetEmail){
            if(row[2] != null){
                sendTaskCompleteEmail(row[0], row[1], row[2])
                await sheets.spreadsheets.values.clear({        //Clear Task for User that Completed the Task
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
    let getResponse = await sheets.spreadsheets.values.get({auth: jwtClient, spreadsheetId: spreadsheetId, range: 'Tasks'});    //Get Values in 'Tasks' sheet
    let values = getResponse.data.values;

    let internTasks = [];
    for(let i = 1; i < values.length; i++){         //Find All Interns and Return List
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
    let getResponse = await sheets.spreadsheets.values.get({auth: jwtClient, spreadsheetId: spreadsheetId, range: dataSheet})   //Get Values in 'Data' sheet
    let values = getResponse.data.values;

    let foundEntry = false;

    for(let row of values){             //Find if Unique Data Already Exists.
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
        await sheets.spreadsheets.values.append({       //Append New Data Entry
            auth: jwtClient,
            spreadsheetId: spreadsheetId,
            range: dataSheet,
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
    let getResponse = await sheets.spreadsheets.values.get({auth: jwtClient, spreadsheetId: spreadsheetId, range: dataSheet});  //Get Values in 'Data' sheet
    let values = getResponse.data.values;

    let sectionEntries = [];
    for(let i = 1; i < values.length; i++){     //Find Entry and Return All Values
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
    let getResponse = await sheets.spreadsheets.values.get({auth: jwtClient, spreadsheetId: spreadsheetId, range: dataSheet});  //Get Values in 'Data' sheet
    let values = getResponse.data.values;

    for(let i = 0; i < values.length; i++){     //Find Entry
        let row = values[i];
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
            await sheets.spreadsheets.values.update({       //Update Entry with New Information
                auth: jwtClient,
                spreadsheetId: spreadsheetId,
                range: dataSheet+'!A'+(i+1),
                valueInputOption: "RAW",
                resource: sheetEntry
            });
            res.status(200).send("Successfully Updated");
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
        let getResponse = await sheets.spreadsheets.values.get({auth: jwtClient, spreadsheetId: spreadsheetId, range: dataSheet}); //Get Values in 'Data' sheet
        let values = getResponse.data.values;

        for(let i = 1; i < values.length; i++){     //Find Data Entry
            let row = values[i];
            if(row[1] == req.body.Id){
                sheets.spreadsheets.batchUpdate({       //Delete Row
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