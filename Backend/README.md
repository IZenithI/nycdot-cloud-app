# IMPORTANT

### Hosting the application locally or in the cloud requires environment variables containing:

- SPREADSHEET_ID
- SECRET_CLIENT_EMAIL
- SECRET_PRIVATE_KEY
- EMAIL_USER
- EMAIL_PASS
- DATASHEET

### These are not included here for security reasons.

### Please reach out to any of us for this information.

# Using a New Datasheet in the Same Spreadsheet

If the application begins to slow down, this is likely due to the size of the data increasing and as a result, increasing query times. 
The application will slow down at a rate of about 1 second for every 20,000 rows.

**Note: Google Spreadsheets has a limit of 5 million cells per sheet, keep in mind ***cells*** and not rows.**

To resolve this issue, we can create a new "Sheet" in the same spreadsheet (found toward the bottom of the spreadsheet), such as "Data1", "Data2", "Data3", etc.

![New Sheet Image](https://github.com/IZenithI/nycdot-cloud-app/blob/Backend/Backend/ReadMeImages/New%20Sheet%20Image.PNG)

Afterwards, change the `DATASHEET` environment variable to the name of the newly created sheet.

This will 'restart' the data sheet while maintaining previous data in the spreadsheet, allowing for the query times to be much faster.

**Note: Make sure all previous data sections are completed as the new Sheet is not connected to the previous sheet and will not query the old and new sheet at the same time.**

# Hosting Locally

**Note: Make sure to have the environment variable file (.env) in the same directory as the index.js file**

To host the backend locally, open the command line, navigate to the Backend folder and run the following lines:

```
npm install
node index.js
```

Upon receiving the "Successfully Connected!" message, you can then use [http://localhost:8000/](http://localhost:8000) as the endpoint, open [http://localhost:8000/docs](http://localhost:8000/docs) to view the backend documentation.

# Hosting in the Cloud (Heroku)

(This process will be different depending on what hosting platform is used.)

To host on [Heroku](https://www.heroku.com/):

1. Create A New App
2. Navigate to App Settings
3. Under `Config Vars`, Add All Environment Variables [Mentioned Above](https://github.com/IZenithI/nycdot-cloud-app/blob/main/Backend/README.md#important)
4. Follow the Directions in the `Deploy` Tab to Deploy With `Heroku Git` or `GitHub`

To verify if the deployment was successful, go to `More` -> `View Logs` and look for the "Successfully Connected!" Message Immediately After Deployment.

If successful, you can then use "https://`<Insert App Name>`.herokuapp.com/" as the endpoint, you can access the backend documentation at "https://`<Insert App Name>`.herokuapp.com/docs".
