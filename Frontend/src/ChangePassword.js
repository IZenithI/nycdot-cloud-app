import { useState } from "react"
import axios from 'axios'
import Button from './components/Button'
import { ToastContainer, toast } from "react-toastify";
import {useNavigate} from "react-router-dom";

import 'react-toastify/dist/ReactToastify.css';
function ChangePassword() {

  const[USER_EMAIL, setUSER_EMAIL] = useState('')
  const[USER_PASSWORD, setUSER_PASSWORD] = useState('')
  const[new_password, set_new_password]=useState('')
  const[confirm_password,set_confirm_password]=useState('')
 
  let navigate = useNavigate();

  const Change=()=>
  {
    if(USER_EMAIL === '')
    {
        toast.warning('Enter your email')
        return
    }
    else if (USER_PASSWORD=== '')
    {
        toast.warning('Enter your password')
        return
    }
    else if (new_password=== '')
    {
        toast.warning('Enter your new password')
        return
    }
    else if (confirm_password=== '')
    {
        toast.warning('Enter your password confirmation')
        return
    }


    
    axios.post('https://nycdot-cloud-app-backend.herokuapp.com/changePassword',
    {
      email: USER_EMAIL,
      currentPassword:USER_PASSWORD,
      newPassword: new_password,
      confirmPassword: confirm_password
    })
    .then(function (response){

      toast.dark('Password Reset Successful')
      navigate("/")
    })
    .catch(function(error){

      if(error.response.status === 401)
      {
        toast.warning('Incorrect Password')
      }
      if(error.response.status === 400)
      {
        toast.warning('New Password Does Not Match')
      }
    })
  }
  



  return (
    
    <div className ='container '>

    <h1> SGD Data Entry </h1>
    <h2> Password Change </h2>

    <div className='form-control'>
      <label>Email</label>
      <input type ='text' placeholder='Enter your Email' 
      value={USER_EMAIL} 
      onChange={(e) => setUSER_EMAIL(e.target.value)}
      />
    </div>

    <div className='form-control'>
      <label>Current Password</label>
      <input type ='password' placeholder='Enter your Current Password' 
      value={USER_PASSWORD} 
      onChange={(e) => setUSER_PASSWORD(e.target.value)}
      />
    </div>

    <div className='form-control'>
      <label>New Password</label>
      <input type ='password' placeholder='Enter your new Password' 
      value={new_password} 
      onChange={(e) => set_new_password(e.target.value)}
      />
    </div>

    <div className='form-control'>
      <label>Confirm Password</label>
      <input type ='password' placeholder='Confirm Password' 
      value={confirm_password} 
      onChange={(e) => set_confirm_password(e.target.value)}
      />
      <Button color='black' text='Request Password Change' onClick = {Change}/>
    </div>

    <ToastContainer />
    </div>

  );
}

export default ChangePassword;
