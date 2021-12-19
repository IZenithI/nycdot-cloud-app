import { useState } from "react"
import axios from 'axios'
import Button from './components/Button'
import { ToastContainer, toast } from "react-toastify";
import {useNavigate} from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import {API_BASE_URL,API_FORGOT_PASSWORD_URL} from "./API_ENDPOINT"

function ForgotPassword() {

  const[USER_EMAIL, setUSER_EMAIL] = useState('')

 
  let navigate = useNavigate();

  const Forgot=()=>
  {
    if(USER_EMAIL === '')
    {
        toast.warning('Enter your email')
        return
    }

    let url = API_BASE_URL + API_FORGOT_PASSWORD_URL
    axios.post(url,
    {
      email: USER_EMAIL
    })
    .then(function (response){

      toast.dark('Successfully Sent Temporary Password.')
      navigate("/")
    })
    .catch(function(error){

      if(error.response.status === 400)
      {
        toast.warning('Email does not exist')
      }
    })
  }
  



  return (
    
    <div className ='container '>

    <h1> SGD Data Entry </h1>
    <h2> Forgot Password </h2>

    <div className='form-control'>
      <label>Email</label>
      <input type ='text' placeholder='Enter your Email' 
      value={USER_EMAIL} 
      onChange={(e) => setUSER_EMAIL(e.target.value)}
      />
    </div>

    <Button color='black' text='Request new Password' onClick = {Forgot}/>

    <ToastContainer />
    </div>

  );
}

export default ForgotPassword;
