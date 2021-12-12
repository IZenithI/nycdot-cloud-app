import Header from './components/Header'
import Tasks from './components/Tasks'
import { useState } from "react"
import AddTask from './components/AddTask'
import axios from 'axios'
import Button from './components/Button'
import { ToastContainer, toast } from "react-toastify";
import Application from './Application'
import Login from './LogIn'
import 'react-toastify/dist/ReactToastify.css';
import ChangePassword from './ChangePassword'
import ForgotPassword from './ForgotPassword'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  Navigate
  
} from "react-router-dom";
function App() {

  // useScript('https://unpkg.com/react@16.12.0/umd/react.production.min.js')
  // useScript('https://unpkg.com/react-dom@16.12.0/umd/react-dom.production.min.js')
  // useScript('https://cdnjs.cloudflare.com/ajax/libs/openlayers/4.3.3/ol.js')
  // useScript('https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.10/lodash.min.js')
  // useScript('https://streetsmart.cyclomedia.com/api/v20.3/StreetSmartApi.js?5c39ff70ceb1412a79ba')


  return (
  <Router>
    <Routes>
      <Route path="/" exact element = {<Login/>}> </Route>

      <Route path="/Application" exact element = {<Application/>}> </Route>
      <Route path="/Change" exact element = {<ChangePassword/>}> </Route>
      <Route path="/Forgot" exact element = {<ForgotPassword/>}> </Route>


      
      <Route path = "*" exact element = {<Navigate to="/"/>} />

    </Routes>
  </Router>
  );
}

export default App;
