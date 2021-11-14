import Header from './components/Header'
import Tasks from './components/Tasks'
import { useEffect, useState } from "react"
import AddTask from './components/AddTask'
import axios from 'axios'
import Button from './components/Button'
import { ToastContainer, toast } from "react-toastify";
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

  const {state} = useLocation();
  const {USER_EMAIL, isIntern} = state;

  const [interns, setInterns] =useState([])
  const [selectedIntern,setselectedIntern] =useState('')
  const [selectedDistrict, setselectedDistrict]=useState('')
  const [Suggestions, setSuggestions] = useState([])

  const[showDataForm, setShowDataForm] = useState(false)
  const[District, setDistrict] = useState('')

  const[currentTask, setCurrentTask] = useState([
      {
        FID:null,
        Id:"",
        Comments: "N/A",
        ImageID: "",
        ImageDat: "",
        Link:"",
        XY:"",
        reminder:false,
        Section:"",
        OnStreet:"",
        CrossStreet1: "",
        CrossStreet2: "",
        PostType:"",
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

  const[emptyEntry, setemptyEntry] = useState([
    
    {
      FID:null,
      Id:"",
      Comments: "",
      ImageID: "",
      ImageDat: "",
      Link:"",
      XY:"",
      reminder:false,
      Section:"",
      OnStreet:"",
      CrossStreet1: "",
      CrossStreet2: "",
      PostType:"",
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



  //Fix later to take in a json instead of hardcoded arrays. 
  const number_of_arms = [1,2,3,4,5];

  const post_type = [
    "TAPERED OCTAGONAL LAMPPOST (8S)",
    "BISHOP CROOK LAMPPOST",
    "30' ALUMINUM DAVIT POLE WITHOUT TRANSFORMER BASE",
    "FLATBUSH AVENUE LAMPPOST",
    "TYPE S LAMPPOST AND LUMINAIRE (ADNY)",
    "40' ALUMINUM LIGHTING STANDARD",
    "TYPE WF 12'-0 STEEL POST FOR PARKS",
    "TYPE B LAMPPOST ",
    "TYPE CITY LIGHT ",
    "TYPE M LAMPPOST (27'-7\")",
    "5TH AVE LAMPPOST",
    "CITY HALL LAMPPOST",
     "ADNY P POLE",
    "Type Flushing Meadows Park Lamppost",
    "Type TBTA lamppost",
    "Type Grand Central lamppost",
    "Type F Lamppost",
    "Type Eastern Parkway Pedestrian lamppost ",
    "Type Eastern Parkway Roadway lamppost" ,
    "Type “Ave. of the Americas” lamppost",
    "Type 14th Street Lamppost ",
    "Other",
  ];

  const post_color = [
    "Standard Silver",
    "Standard Green",
    "Standard Brown",
    "Standard Black",
    "Other"
    ];

  const post_luminare = [
    "City Light Luminaire",
    "Type S Luminaire",
    "Type Teardrop",
    "LED COBRAHEAD LUMINAIRE",
    "RIVERSIDE LUMINAIRE",
    "2085 PARK LUMINAIRE",
    "CENTRAL PARK TYPE LUMINAIRE FOR TYPE B",
    "KING TYPE LUMINAIRE",
    "Flushing Meadow Park Luminaire",
    "Fire Alarm Luminaire",
    "LED Expressway",
    "Other"
  ];

  const post_attachment = [
    "Pole Top Antenna (DOITT)",
    "Pole Top Node (DOITT)",
    "Police Camera (ARGUS)",
    "Banner",
    "Load Limit Banner Bracket (LLBB)",
    "Department of Environmental Protection (DEP) Department of Emergency Response and Technical Assessment (DERTA)",
    "Department of Environmental Protection (DEP) Data Collection Unit (DCU)",
    "Dept. of Health/Hygiene (DOHMH) Air Quality Monitor",
    "Con Ed Advanced Metering Infrastructure (AMI)",
    "Red Light Camera (RLC)",
    "Speed Camera",
    "Remote Traffic Microwave Sensor (RTMS)",
    "RFID/Antenna Panel",
    "Pedestrian Signal",
    "ASTC Controller",
    "Road Side Unit (RSU)",
    "Eruv",
    "NYPD Gun shot detector",
    "Department of Homeland Security",
    "Other attachment"
  ];

  const post_teardrop=[
    "Type 1",
    "Type 2",
    "Type 3",
    "Type 4",
    "Type 5",
    "Type 6",
    "Type 7",
    "N/A"
  ]

  const post_streets=[
    "10 AVENUE",
    "14 STREET/CANARSIE LINE",
    "4 AVENUE",
    "5 AVENUE",
    "6 AVENUE LINE",
    "7 AVENUE",
    "7 AVENUE SOUTH",
    "8 AVENUE",
    "8 AVENUE LINE",
    "9 AVENUE",
    "ASTOR PLACE",
    "AVENUE OF THE AMERICAS",
    "BANK STREET",
    "BARROW STREET",
    "BAXTER STREET",
    "BEDFORD STREET",
    "BETHUNE STREET",
    "BIKE PATH",
    "BLEECKER STREET",
    "BLOOMFIELD STREET",
    "BOND STREET",
    "BOWERY",
    "BROADWAY",
    "BROADWAY LINE",
    "BROOME STREET",
    "CANAL STREET",
    "CARMINE STREET",
    "CENTRE MARKET PLACE",
    "CENTRE STREET",
    "CHARLES LANE",
    "CHARLES STREET",
    "CHARLTON STREET",
    "CHRISTOPHER STREET",
    "CLARKSON STREET",
    "CLEVELAND PLACE",
    "COMMERCE STREET",
    "COOPER SQUARE",
    "CORNELIA STREET",
    "CROSBY STREET",
    "DOMINICK STREET",
    "DOWNING STREET",
    "DRIVEWAY",
    "EAST 1 STREET",
    "EAST 10 STREET",
    "EAST 11 STREET",
    "EAST 12 STREET",
    "EAST 13 STREET",
    "EAST 4 STREET",
    "EAST 8 STREET",
    "EAST 9 STREET",
    "EAST HOUSTON STREET",
    "ELIZABETH STREET",
    "GANSEVOORT STREET",
    "GAY STREET",
    "GRAND STREET",
    "GREAT JONES ALLEY",
    "GREAT JONES STREET",
    "GREENE STREET",
    "GREENWICH AVENUE",
    "GREENWICH COURT",
    "GREENWICH MEWS",
    "GREENWICH STREET",
    "GROVE COURT",
    "GROVE STREET",
    "HESTER STREET",
    "HIGH LINE",
    "HOLLAND TUNNEL",
    "HOLLAND TUNNEL APPROACH",
    "HOLLAND TUNNEL ENTRANCE",
    "HOLLAND TUNNEL EXIT",
    "HORATIO STREET",
    "HOUSTON/ESSEX STREET LINE",
    "HOWARD STREET",
    "HUDSON RIVER GREENWAY",
    "HUDSON STREET",
    "IRT-1-BROADWAY/ 7 AVENUE LINE",
    "JANE STREET",
    "JERSEY STREET",
    "JONES ALLEY",
    "JONES STREET",
    "KENMARE STREET",
    "KING STREET",
    "LA GUARDIA PLACE",
    "LAFAYETTE STREET",
    "LEROY STREET",
    "LEXINGTON AVENUE LINE",
    "LITTLE WEST 12 STREET",
    "MAC DOUGAL ALLEY",
    "MAC DOUGAL STREET",
    "MANHATTAN BRIDGE LINE",
    "MERCER STREET",
    "MILLIGAN PLACE",
    "MINETTA LANE",
    "MINETTA STREET",
    "MORTON STREET",
    "MOTT STREET",
    "MULBERRY STREET",
    "NASSAU STREET LINE",
    "PATCHIN PLACE",
    "PATH-JOURNAL SQ- 33 ST LINE",
    "PEDESTRIAN AND BIKE PATH LINK",
    "PEDESTRIAN PATH",
    "PERRY STREET",
    "PIER",
    "PIER 40 DRIVEWAY",
    "PRINCE STREET",
    "RENWICK STREET",
    "RIVINGTON STREET",
    "SHINBONE ALLEY",
    "SPRING STREET",
    "ST LUKES PLACE",
    "STABLE COURT",
    "STANTON STREET",
    "SULLIVAN STREET",
    "THOMPSON STREET",
    "UNIVERSITY PLACE",
    "VANDAM STREET",
    "VARICK STREET",
    "WANAMAKER PLACE",
    "WASHINGTON MEWS",
    "WASHINGTON PLACE",
    "WASHINGTON SQUARE EAST",
    "WASHINGTON SQUARE NORTH",
    "WASHINGTON SQUARE SOUTH",
    "WASHINGTON SQUARE WEST",
    "WASHINGTON STREET",
    "WATTS STREET",
    "WAVERLY PLACE",
    "WEEHAWKEN STREET",
    "WEST 10 STREET",
    "WEST 11 STREET",
    "WEST 12 STREET",
    "WEST 13 STREET",
    "WEST 14 STREET",
    "WEST 3 STREET",
    "WEST 4 STREET",
    "WEST 8 STREET",
    "WEST 9 STREET",
    "WEST BROADWAY",
    "WEST HOUSTON STREET",
    "WEST STREET",
    "WOOSTER STREET"
  ];


  useEffect(() => {
    const fetchData = async () => {
      if(!isIntern)
      {
      const response = await 
        axios.get('https://nycdot-cloud-app-backend.herokuapp.com/getInterns',
      );
      setInterns(response.data);
      }
    };
    fetchData();
  }, []);




  useEffect(() => {
    if(isIntern)
    {
      getTask()
    }
  },[]);

  useEffect(() => {
    if(isIntern)
    {
      retrieveData()
    }
  },[District]);


  //Delete Task 
  const deleteTask = (task) => {
    if (window.confirm("Are you sure you wish to delete this item?") === true)
    {
      console.log(task.Id)
      axios.post('https://nycdot-cloud-app-backend.herokuapp.com/deleteEntry',
      {
        Id:task.Id,
        role:"admin"
      })
      .then(function (response){
        console.log(response);
        setDistrict(task.Section)
        retrieveData()  
        toast.dark('Successfully Deleted')
      })
      .catch(function(error){
        toast.warning('Delete was unsuccessful')
      })
    }
    else return


  }

  //Toggle Reminder
  const toggleReminder = (task) => {
    console.log(task);
    //setTasks(tasks.map((task) => task.FID === id ? { ...task, reminder: !task.reminder} : task ))
    setShowDataForm(!showDataForm)
    setCurrentTask(task);

    if(!showDataForm)
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  // Submit Data Entry 
   const submitData = (data) => {
    console.log(data)
    console.log(tasks)
    setDistrict(data.Section)
    if(tasks.some(task => task.Id === data.Id))
    {
      console.log('updating')
      axios.put('https://nycdot-cloud-app-backend.herokuapp.com/updateEntry',
      {
        FID:data.FID,
        Id:data.Id,
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
        NoArms:data.NoArms,
        PostColor:data.PostColor,
        LuminaireType:data.LuminaireType,
        TeardropType:data.TeardropType,
        AttachmentType1:data.AttachmentType1,
        AttachmentType2:data.AttachmentType2,
        AttachmentType3:data.AttachmentType3,
      })
      .then(function (response){
        setDistrict(data.Section)
        retrieveData()
        console.log(response.data)
        setShowDataForm(false)
        toast.dark('Update was successful')
      })
      .catch(function(error){
        console.log(error)
        toast.warning('Update failed')
      })
    }   
    else {
     console.log('Adding new entry')
     axios.post('https://nycdot-cloud-app-backend.herokuapp.com/createEntry',
     {
       FID:data.FID,
       Id:data.Id,
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
       NoArms:data.NoArms,
       PostColor:data.PostColor,
       LuminaireType:data.LuminaireType,
       TeardropType:data.TeardropType,
       AttachmentType1:data.AttachmentType1,
       AttachmentType2:data.AttachmentType2,
       AttachmentType3:data.AttachmentType3,
     })
     .then(function (response){
       const newTask = {...data}
       setTasks([...tasks,newTask])
       setShowDataForm(false)
       //setDistrict(data.Section)
       toast.dark('Successfully added new entry')
     })
     .catch(function(error){
       console.log(error)
       toast.warning('Failed to add new entry')
     })
  }
}



  const retrieveData =() => {
    if(District !== '' )
    {
        axios.post('https://nycdot-cloud-app-backend.herokuapp.com/getSection',
      {
        Section: District
      })
      .then(function (response){
        //toast.dark('Successfully retrieved district data')
        console.log(response);
        setTasks(response.data)
      })
      .catch(function(error){
        toast.warning('Failed to retrieve district data')
        console.log(error)
        setTasks([])
      })
    }
  }


  const getTask = () => 
  {
    axios.post('https://nycdot-cloud-app-backend.herokuapp.com/getTask',
    {
      targetEmail: USER_EMAIL
    })
    .then(function (response){
      toast.dark('Successfully retrieved tasks')
      console.log(response.data);
      setDistrict(response.data)
      retrieveData()
    })
    .catch(function(error){
      toast.warning('You have no tasks')
      console.log(error)
    })
  }

  const assignTask = ()=>
  {
    axios.post('https://nycdot-cloud-app-backend.herokuapp.com/assignTask',
    {
      senderEmail: USER_EMAIL,
      targetEmail: selectedIntern,
      task: selectedDistrict
    })
    .then(function (response){
      toast.dark('Successfully assigned task')
      console.log(response);
      setselectedIntern('')
      setselectedDistrict('')
    })
    .catch(function(error){
      toast.warning('Already has a task')
      console.log(error)
    }) 
  }

 

  const getInternsandTasks =()=>
  {
    axios.get('https://nycdot-cloud-app-backend.herokuapp.com/getInterns',
    {
    })
    .then(function (response){
      toast.dark('Successfully retrieved interns')
      setInterns(response.data)
      console.log(interns)
    })
    .catch(function(error){
      toast.warning('You have no interns..')
      console.log(error)
    })
  }

  const submitTask =()=>
  {
    axios.post('https://nycdot-cloud-app-backend.herokuapp.com/completeTask',
    {
      targetEmail:USER_EMAIL
    })
    .then(function (response){
      toast.dark('Successfully Submitted Tasks')
      console.log(response);
    })
    .catch(function(error){
      toast.warning('Failed to submit task..')
      console.log(error)
    })
  }

  let InternNames = interns.map(a => a.internEmail)
  const onChangeHandler = (text) => {    
    let matches =[]
    if(text.length>0)
    {
      matches = InternNames.filter(user => {
        const regex = new RegExp( `${text}`, "gi");
        return user.match(regex)
      })
    }
    console.log('matches', matches)
    setSuggestions(matches)
    setselectedIntern(text)
  }

  const onSuggestionHandler=(text)=>{
    setselectedIntern(text);
    setSuggestions([])
  }

  return (
  <div className="container">
      <Header emptyEntry={() => setCurrentTask(emptyEntry)} 
      onAdd={()=> setShowDataForm(!showDataForm)}
      showDataForm={showDataForm}
    />

    <h2>{USER_EMAIL}</h2>
    { showDataForm && 
    <AddTask 
      onAdd={submitData}
      
      entry = {currentTask}
      prop_streets = {post_streets} 
      prop_types ={post_type} 
      prop_number = {number_of_arms}
      prop_color={post_color}
      prop_luminare={post_luminare} 
      prop_attachment={post_attachment} 
      prop_teardrop={post_teardrop}
    />}
     
     {tasks.length > 0 ? (<Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} />) : ('No Tasks to Show')}

     {!isIntern && <div className='form-control'>
      <label>Find another District</label>
      <input type ='text' placeholder='Input a District' 
      value={District} 
      onChange={(e) => setDistrict(e.target.value)}
      />
      <Button color='black' text='Retrieve' onClick = {retrieveData}/>
    </div>}

    {!isIntern && <div className='form-control'>
      <label>Assign an Intern a Task </label>
      <input type ='text' placeholder='Input an Intern' 
      onChange={(e) => onChangeHandler(e.target.value)}
      value={selectedIntern} 
      onBlur={()=>{
        setTimeout(() => {
            setSuggestions([])
        }, 100 )
      }}
      />
      {Suggestions && Suggestions.map((suggestion,i) =>
      <div key={i}  className="suggestion" 
        onClick={() => onSuggestionHandler(suggestion)}
      >{suggestion} </div>
      )}

      <input type ='text' placeholder='Input a section' 
      onChange={(e) => setselectedDistrict(e.target.value)}
      value={selectedDistrict} 
      />
      <Button color='black'  text = "Assign" onClick = {assignTask}> </Button>
    </div>}

    
    {!isIntern && <Button color='black' text='Get Interns with task' onClick = {getInternsandTasks}/>}

    {(isIntern && District!='') && <Button color='black' text='Reload Tasks' onClick = {getTask}/>}
    {(isIntern && District!='') && <Button color='black' text='Submit Task' onClick = {submitTask}/>}


    <ToastContainer />
    </div>
  );
}

export default Application;
