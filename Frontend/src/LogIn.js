
import { useState } from "react"
import axios from 'axios'
import Button from './components/Button'
import { ToastContainer, toast } from "react-toastify";
import {useNavigate} from "react-router-dom";

import 'react-toastify/dist/ReactToastify.css';
function Login() {


  const[SignUp, setSignUp] = useState('')
  const[SignedUp,setSignedUp] = useState(false)
  const[USER_EMAIL, setUSER_EMAIL] = useState('')
  const[SignedIn, setSignedIn] = useState(false)
  const[USER_PASSWORD, setUSER_PASSWORD] = useState('')
  const[ShowForgot,setShowForgot]=useState(false)
  const[new_password, set_new_password]=useState('')
  const[confirm_password,set_confirm_password]=useState('')
 
  let navigate = useNavigate();

  const signup=()=>{

    let tester = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if ( tester.test(SignUp) ) {
        axios.post('https://nycdot-cloud-app-backend.herokuapp.com/signup',
        {
          email: SignUp,
          role:"intern"
        })
        .then(function (response){
          //console.log(response);
          toast.dark('Sign up successful')
          setSignedUp(true)
          
        })
        .catch(function(error){
          //console.log(error)
          setSignedUp(false)
          toast.warning('There is already an account associated with that email.')
        })
    }
    else {
        toast.warning('Please enter a valid Email')
    }



    
  }


  const signin=()=>{
    axios.post('https://nycdot-cloud-app-backend.herokuapp.com/signin',
    {
      email: USER_EMAIL,
      password:USER_PASSWORD
    })
    .then(function (response){
      //console.log(response);
      setSignedIn(true)
      toast.dark('Sign in successful')
      //console.log(response.data)

      if(response.data === 'intern')  
      {
        //console.log("this is an intern")
 
        //console.log(USER_EMAIL)
        navigate("/Application", {state: {USER_EMAIL:USER_EMAIL, isIntern: true }})
      }

      if (response.data === 'admin')
    {
        //console.log("this is an admin")
        //console.log(USER_EMAIL)
        navigate("/Application", {state: {USER_EMAIL:USER_EMAIL, isIntern: false }})
    }

    })
    .catch(function(error){
      setSignedIn(false)
      //console.log(error)
      //toast.warning('Log in was unsuccessful')
      if(error.response.status === 401)
      {
        toast.warning('Incorrect Password')
      }

      if(error.response.status === 400)
      {
        toast.warning('User was not found')
      }
    })
  }
  const showChangePassword=()=>
  {
    navigate("/Change")
  }

  const showForgotPassword=()=>
  {
    navigate("/Forgot")
  }
  
  



  return (
    
    <div className ='container '>

    <h1> SGD Data Entry </h1>

    {(!SignedUp &&  !SignedIn ) && <div className='form-control'>
      <label>Sign up</label>
      <input type ='email' placeholder='Enter your Email' 
      value={SignUp} 
      onChange={(e) => setSignUp(e.target.value)}
      />
      <Button color='black' text='Sign up ' onClick = {signup}/>
    </div>}

    {!SignedIn && <div className='form-control'>
      <label>Sign In</label>
      <input type ='text' placeholder='Enter your Email' 
      value={USER_EMAIL} 
      onChange={(e) => setUSER_EMAIL(e.target.value)}
      />
      
    </div>}

    {!SignedIn && <div className='form-control'>
      <label>Password</label>
      <input type ='password' placeholder='Enter your Password' 
      value={USER_PASSWORD} 
      onChange={(e) => setUSER_PASSWORD(e.target.value)}
      />
    </div>}

    <Button color='black' text='Sign in' onClick = {signin}/>

    <Button color='black' text='Change Password' onClick = {showChangePassword}/>
    <Button color='black' text='Forgot Password' onClick = {showForgotPassword}/>


    



    




    <ToastContainer />
    </div>

  );
}

export default Login;
