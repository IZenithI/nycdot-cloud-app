# Frontend 
### Opening the application locally requires an environment variable file containing:

- REACT_APP_ATLAS_TOKEN
- REACT_APP_ATLAS_API_KEY

### These are not included here and can be obtained from Cyclomedia.

### To create the .env file follow the format below and place it inside of the root directory alongside the src folder. 

- REACT_APP_ATLAS_TOKEN =  `<Your Atlas Panorama credential token>` in the format Username:Password:
- REACT_APP_ATLAS_API_KEY = `<Your Cyclomedia API key> `

## Changing the API Endpoints 

To change the API Endpoints you can alter the API_ENDPOINT.js file to match the URL to however you are hosting the API.  

## Changing the Data Form Fields 

To change the street names and other attributes of the data form you can alter the streetNames.js file.

## Running the program locally 

**Note: Make sure to have the environment variable file (.env) in the same directory as the src folder**

To open the Frontend locally, open the command line, navigate to the Frontend folder and run the following lines:

```
npm install
npm start
```

If it is successful, you can now open [http://localhost:3000/](http://localhost:3000/) to view the application. 

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Available Scripts

In the project directory, you can run:
### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

