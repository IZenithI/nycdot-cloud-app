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

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  Navigate
  
} from "react-router-dom";
function App() {

  return (
  <Router>
    <Routes>
      <Route path="/" exact element = {<Login/>}> </Route>

      <Route path="/Application" exact element = {<Application/>}> </Route>
      
      <Route path = "*" exact element = {<Navigate to="/"/>} />

    </Routes>
  </Router>
  );
}

export default App;
