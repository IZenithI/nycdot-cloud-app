import Header from './components/Header'
import Tasks from './components/Tasks'
import { useEffect, useState, useMemo } from "react"
import AddTask from './components/AddTask'
import axios from 'axios'
import Button from './components/Button'
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Modal from './components/Modal'
import { number_of_arms, post_attachment, post_luminare, post_color, post_type, post_streets, post_teardrop } from './streetNames'
import Select, { createFilter, components } from 'react-select';
import AsyncSelect from 'react-select/async';
import WindowedSelect from "react-windowed-select";

import {API_BASE_URL, API_ASSIGN_TASK_URL,API_GET_TASK_URL,API_COMPLETE_TASK_URL,API_GET_INTERNS_URL,API_CREATE_ENTRY_URL, API_GET_SECTION_URL, API_UPDATE_ENTRY_URL, API_DELETE_ENTRY_URL} from './API_ENDPOINT'



import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation
} from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

function Application() {

  const { state } = useLocation();
  const { USER_EMAIL, isIntern } = state;

  const [interns, setInterns] = useState([])
  const [selectedIntern, setselectedIntern] = useState('')
  const [selectedDistrict, setselectedDistrict] = useState('')
  const [Suggestions, setSuggestions] = useState([])

  const [showDataForm, setShowDataForm] = useState(false)
  const [District, setDistrict] = useState('')

  const [reminders, setReminders] = useState([])
  const [picture, setPicture] = useState('')

  const[internObjects,setinternObjects] = useState([])

  const [selectedValue, setSelectedValue] = useState('')

  const [currentTask, setCurrentTask] = useState([
    {
      FID: null,
      Id: "",
      Comments: "N/A",
      ImageID: "",
      ImageDat: "",
      Link: "",
      XY: "",
      reminder: false,
      Section: "",
      OnStreet: "",
      CrossStreet1: "",
      CrossStreet2: "",
      PostType: "",
      PedestrianArm: false,
      NoArms: 0,
      PostColor: "",
      LuminaireType: "",
      TeardropType: "",
      AttachmentType1: "",
      AttachmentType2: "",
      AttachmentType3: "",
    },
  ])

  const [emptyEntry, setemptyEntry] = useState([

    {
      FID: null,
      Id: "",
      Comments: "",
      ImageID: "",
      ImageDat: "",
      Link: "",
      XY: "",
      reminder: false,
      Section: "",
      OnStreet: "",
      CrossStreet1: "",
      CrossStreet2: "",
      PostType: "",
      PedestrianArm: false,
      NoArms: 4,
      PostColor: "",
      LuminaireType: "",
      TeardropType: "",
      AttachmentType1: "",
      AttachmentType2: "",
      AttachmentType3: "",
    },
  ])



  const [tasks, setTasks] = useState([
  ])

  const internSet=() =>
  {
    let temp =[]
    for (var i = 0; i < interns.length; i++) {
      const object = {
        value: interns[i].internEmail,
        label: interns[i].internEmail
      }
      temp.push(object)
    }

    setinternObjects(temp)
  }




  useEffect(() => {
    const fetchData = async () => {
      if (!isIntern) {
        let url = API_BASE_URL+API_GET_INTERNS_URL
        const response = await
          axios.get(url,
          );
        setInterns(response.data);
        //internSet(response.data)
      }
    };
    fetchData();
  }, []);




  useEffect(() => {
    if (isIntern) {
      getTask()
    }
  }, []);

  useEffect(() => {
    if (isIntern) {
      retrieveData()
    }
  }, [District]);

  useEffect(() => {
    if (currentTask.FID != null)
      atlasFetch()
  }, [currentTask])


  let navigate = useNavigate();

  const objects = []
  for (var i = 0; i < post_streets.length; i++) {
    const object = {
      value: post_streets[i],
      label: post_streets[i]
    }
    objects.push(object)
  }

  //Delete Task 
  const deleteTask = (task) => {
    if (window.confirm("Are you sure you wish to delete this item?") === true) {
      if(isIntern === true)
      {
        toast.warning('You do not have permission to delete an entry. ')
      }

      else 
      {
        let url = API_BASE_URL+API_DELETE_ENTRY_URL
        axios.post(url,
        {
          Id: task.Id,
          role: "admin"
        })
        .then(function (response) {
          console.log(response);
          setDistrict(task.Section)
          retrieveData()
          toast.dark('Successfully Deleted')
          retrieveData()
        })
        .catch(function (error) {
          toast.warning('Delete was unsuccessful')
        })
    }
      }
      //console.log(task.Id)
      
    else return


  }

  //Toggle Reminder
  const toggleReminder = (task) => {



    //console.log(task);
    //setTasks(tasks.map((task) => task.FID === tasks.FID ? { ...task, reminder: !task.reminder} : task ))
    task.reminder = true

    setShowDataForm(!showDataForm)
    setCurrentTask(task);

    if (!showDataForm) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setPicture('')
      console.log('ran')
    }


  }

  // Submit Data Entry 
  const submitData = (data) => {
    //console.log(data)
    //console.log(tasks)
    setDistrict(data.Section)
    if (tasks.some(task => task.Id === data.Id)) {
      //console.log('updating')
      let url = API_BASE_URL+API_UPDATE_ENTRY_URL
      axios.put(url,
        {
          FID: data.FID,
          Id: data.Id,
          Comments: data.Comments,
          ImageID: data.ImageID,
          ImageDat: data.ImageDat,
          Link: data.Link,
          XY: data.XY,
          Section: data.Section,
          OnStreet: data.OnStreet,
          CrossStreet1: data.CrossStreet1,
          CrossStreet2: data.CrossStreet2,
          PostType: data.PostType,
          PedestrianArm: data.PedestrianArm,
          NoArms: data.NoArms,
          PostColor: data.PostColor,
          LuminaireType: data.LuminaireType,
          TeardropType: data.TeardropType,
          AttachmentType1: data.AttachmentType1,
          AttachmentType2: data.AttachmentType2,
          AttachmentType3: data.AttachmentType3,
        })
        .then(function (response) {
          setDistrict(data.Section)
          retrieveData()
          //console.log(response.data)
          setShowDataForm(false)
          toast.dark('Update was successful')
          console.log(currentTask)
          createReminder()
        })
        .catch(function (error) {
          console.log(error)
          toast.warning('Update failed')
        })
    }
    else {
      //console.log('Adding new entry')
      let url = API_BASE_URL+API_CREATE_ENTRY_URL
      axios.post(url,
        {
          FID: data.FID,
          Id: data.Id,
          Comments: data.Comments,
          ImageID: data.ImageID,
          ImageDat: data.ImageDat,
          Link: data.Link,
          XY: data.XY,
          Section: data.Section,
          OnStreet: data.OnStreet,
          CrossStreet1: data.CrossStreet1,
          CrossStreet2: data.CrossStreet2,
          PostType: data.PostType,
          PedestrianArm: data.PedestrianArm,
          NoArms: data.NoArms,
          PostColor: data.PostColor,
          LuminaireType: data.LuminaireType,
          TeardropType: data.TeardropType,
          AttachmentType1: data.AttachmentType1,
          AttachmentType2: data.AttachmentType2,
          AttachmentType3: data.AttachmentType3,
        })
        .then(function (response) {
          const newTask = { ...data }
          setTasks([...tasks, newTask])
          setShowDataForm(false)
          //setDistrict(data.Section)
          toast.dark('Successfully added new entry')
        })
        .catch(function (error) {
          //console.log(error)
          toast.warning('Failed to add new entry')
        })
    }
  }



  const retrieveData = () => {
    if (District !== '') {
      let url = API_BASE_URL + API_GET_SECTION_URL
      axios.post(url,
        {
          Section: District
        })
        .then(function (response) {
          //toast.dark('Successfully retrieved district data')
          //console.log(response);
          setTasks(response.data)
        })
        .catch(function (error) {
          toast.warning('Failed to retrieve district data')
          //console.log(error)
          setTasks([])
        })
    }


  }


  const getTask = () => {
    let url = API_BASE_URL + API_GET_TASK_URL
    axios.post(url,
      {
        targetEmail: USER_EMAIL
      })
      .then(function (response) {
        toast.dark('Successfully retrieved tasks')
        //console.log(response.data);
        setDistrict(response.data)
        retrieveData()
      })
      .catch(function (error) {
        toast.warning('You have no tasks')
        setTasks([])
        //console.log(error)
      })
  }

  const assignTask = () => {
    let url = API_BASE_URL+API_ASSIGN_TASK_URL
    axios.post(url,
      {
        senderEmail: USER_EMAIL,
        targetEmail: selectedIntern,
        task: selectedDistrict
      })
      .then(function (response) {
        toast.dark('Successfully assigned task')
        //console.log(response);
        setselectedIntern('')
        setselectedDistrict('')
      })
      .catch(function (error) {
        toast.warning('Intern already has a task')
        //console.log(error)
      })
  }



  const getInternsandTasks = () => {
    let url = API_BASE_URL+API_GET_INTERNS_URL
    axios.get(url,
      {
      })
      .then(function (response) {
        toast.dark('Successfully retrieved interns')
        setInterns(response.data)
        console.log(interns)
      })
      .catch(function (error) {
        toast.warning('You have no interns..')
        console.log(error)
      })
  }

  const submitTask = () => {
    if (window.confirm("Are you sure you wish to submit this task?") === true) {
      let url = API_BASE_URL+API_COMPLETE_TASK_URL
      axios.post(url,
        {
          targetEmail: USER_EMAIL
        })
        .then(function (response) {
          toast.dark('Successfully Submitted Tasks')
          //console.log(response);
          //emailtest()
          setTasks([])
          setDistrict('')
        })
        .catch(function (error) {
          toast.warning('Failed to submit task..')
          //console.log(error)
        })
    }
  }

  let InternNames = interns.map(a => a.internEmail)
  const onChangeHandler = (text) => {
    let matches = []
    if (text.length > 0) {
      matches = InternNames.filter(user => {
        const regex = new RegExp(`${text}`, "gi");
        return user.match(regex)
      })
    }
    //console.log('matches', matches)
    setSuggestions(matches)
    setselectedIntern(text)
  }

  const onSuggestionHandler = (text) => {
    setselectedIntern(text);
    setSuggestions([])
  }

  const createReminder = () => {

    let temp = reminders
    temp.push(currentTask.FID)
    //console.log(temp)
    setReminders(temp)
  }

  const token = 'NYCDOT:DOTAPI'
  let atlas_apiKey = process.env.REACT_APP_ATLAS_API_KEY
  let atlas_token = process.env.REACT_APP_ATLAS_TOKEN
  
  const atlasFetch = () => {
    if (currentTask.FID != null) {
      var baseurl = 'https://atlas.cyclomedia.com/PanoramaRendering/RenderByLocation2D/'

      var srs = '2263'
      //console.log(currentTask)
      var XY = currentTask.XY
      const XY_Array = XY.split(',');

      //console.log(XY_Array)

      var xcor = XY_Array[0]
      var ycor = XY_Array[1]

      var extra = '?width=1024&height=786&'

      var combinedurl = baseurl + srs + '/' + xcor + '/' + ycor + '/' + extra + 'apiKey=' + atlas_apiKey
      //console.log(combinedurl)


      const encodedString = Buffer.from(atlas_token).toString('base64');
      fetch(combinedurl,
        {
          headers: new Headers({
            'Authorization': `Basic ${encodedString}`,
          })
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not OK');
          }
          return response.blob();
        })
        .then(myBlob => {
          let imageNode = document.getElementById('AtlasImage')
          //imageNode.src = URL.createObjectURL(myBlob);

          //console.log(URL.createObjectURL(myBlob))

          setPicture(URL.createObjectURL(myBlob));
        })
        .catch(error => {
          console.error('There has been a problem with your fetch operation:', error);
        });
    }
  }


  const handleInternChange = (value) => {
    setselectedIntern(value.value)
    console.log(`Selected list:`, value.value);
    console.log(selectedIntern)
  }


  const logout = () => {
    navigate("/");
  }

  const openDataForm = () => {
    setCurrentTask(emptyEntry)
    setPicture('')
  }

  const onMenuOpen = () => {
    setTimeout(() => {
      internSet()
    }, 500);
  };


  return (
    <div className="container">

      <Header emptyEntry={openDataForm}
        onAdd={() => setShowDataForm(!showDataForm)}
        showDataForm={showDataForm}
        isIntern={isIntern}
      />


      <h2>{USER_EMAIL}</h2>
      {showDataForm && <img src={picture} id="AtlasImage" className="AtlasImage"></img>}
      {showDataForm &&
        <AddTask
          onAdd={submitData}
          entry={currentTask}
          prop_streets={post_streets}
          prop_types={post_type}
          prop_number={number_of_arms}
          prop_color={post_color}
          prop_luminare={post_luminare}
          prop_attachment={post_attachment}
          prop_teardrop={post_teardrop}
          streetObjects={objects}

        />}
      {!isIntern && <div className='form-control'>
        <label>Find another District</label>
        <input type='text' placeholder='Input a District'
          value={District}
          onChange={(e) => setDistrict(e.target.value)}
        />
        <Button color='black' text='Retrieve' onClick={retrieveData} />

      </div>}

      {(tasks.length > 0) ? (<Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} reminders={reminders} />) : ('There are no Tasks')}



     
      {!isIntern && <div className='form-control'>
        <label>Assign an Intern a Task </label>
        <input type='text' placeholder='Input an Intern'
          onChange={(e) => onChangeHandler(e.target.value)}
          value={selectedIntern}
          onBlur={() => {
            setTimeout(() => {
              setSuggestions([])
            }, 100)
          }}
        />
        {Suggestions && Suggestions.map((suggestion, i) =>
          <div key={i} className="suggestion"
            onClick={() => onSuggestionHandler(suggestion)}
          >{suggestion} </div>
        )}



        <input type='text' placeholder='Input a section'
          onChange={(e) => setselectedDistrict(e.target.value)}
          value={selectedDistrict}
        />
        <Button color='black' text="Assign" onClick={assignTask}> </Button>
      </div>}






{/* {      <Select
      options={internObjects}
            onMenuOpen={onMenuOpen}
            isSearchable
            isClearable
            filterOption={createFilter({ignoreAccents: false})}
            onChange={handleInternChange}
            placeholder={'Select an Intern'}
            />} */}





      {(isIntern && District != '') && <Button color='black' text='Submit Task' onClick={submitTask} />}





      <Button className="logoutbutton" color='black' text='Log Out' onClick={logout} />
      <ToastContainer />


    </div>
  );
}

export default Application;
