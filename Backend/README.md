# IMPORTANT

### Hosting the application locally or in the cloud requires an environment variable containing:

- SPREADSHEET_ID
- SECRET_CLIENT_EMAIL
- SECRET_PRIVATE_KEY
- EMAIL_USER
- EMAIL_PASS
- DATASHEET

### These are not included here for security reasons.

### Please reach out to any of us for this information.


# Hosting Locally

**Note: Make sure to have the environment variable file (.env) in the same directory as the index.js file**

To host the backend locally, open the command line, navigate to the Backend folder and run the following lines:

```
npm install
node index.js
```

Upon receiving the "Successfully Connected!" message, open [http://localhost:8000/docs](http://localhost:8000/docs) to view the backend documentation.

# Hosting in the Cloud (Heroku)

(This process will be different depending on what hosting platform is used.)

To host on [Heroku](https://www.heroku.com/):

1. Create A New App
2. Navigate to App Settings
3. Under `Config Vars`, Add All Environment Variables [Mentioned Above](https://github.com/IZenithI/nycdot-cloud-app/new/Backend/Backend#important)
4. Follow the Directions in the `Deploy` Tab to Deploy With `Heroku Git` or `GitHub`

To verify if the deployment was successful, go to `More` -> `View Logs` and look for the "Successfully Connected!" Message Immediately After Deployment.

If successful, you can access the backend documentation at "https://`<Insert App Name>`.herokuapp.com/docs".
