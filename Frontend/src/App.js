import Header from './components/Header'
import Tasks from './components/Tasks'
import { useState } from "react"
import AddTask from './components/AddTask'
import axios from 'axios'
import Button from './components/Button'
import { FaSoundcloud } from 'react-icons/fa'
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
function App() {

  const[showDataForm, setShowDataForm] = useState(false)
  const[District, setDistrict] = useState('')
  const[searched, setSearched] = useState(false)

  const[found, setFound] = useState(null)

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
    // {
    //   FID: 0,
    //   Id:'Point-feature-ckcbu3itt07jt3a6xcrl9khhj',
    //   Comments: "N/A",
    //   ImageID: "WE1B8TSD",
    //   ImageDat: "3/21/2020 4:48 PM",
    //   Link:"https://streetsmart.cyclomedia.com/streetsmart?q=985891.069869;207134.137947;2263",
    //   XY:"985891.069869,207134.137947",
    //   reminder:false,
    //   Section:"410A",
    //   OnStreet:"BETHUNE STREET",
    //   CrossStreet1: "DOWNING STREET",
    //   CrossStreet2: "BLOOMFIELD STREET",
    //   PostType:"TYPE CITY LIGHT ",
    //   PedestrianArm: false,
    //   NoArms: 4,
    //   PostColor: "Standard Green",
    //   LuminaireType: "CENTRAL PARK TYPE LUMINAIRE FOR TYPE B",
    //   TeardropType: "Type 5",
    //   AttachmentType1: "TAPERED OCTAGONAL LAMPPOST (8S)",
    //   AttachmentType2: "TYPE CITY LIGHT ",
    //   AttachmentType3: "Type Flushing Meadows Park Lamppost",
    // },
    // {
    //   FID: 1,
    //   Id:'Point-feature-ckcbvi6ds0ei33a6xcd2h1b7x',
    //   Comments: "N/A",
    //   ImageID: "WE1BA939",
    //   ImageDat: "3/21/2020 1:32 PM",
    //   Link:"https://streetsmart.cyclomedia.com/streetsmart?q=986666.111626;205990.790168;2263",
    //   XY:"986666.111626,205990.790168",
    //   reminder:false,
    //   Section:"411A",
    //   OnStreet:"BETHUNE STREET",
    //   CrossStreet1: "DOWNING STREET",
    //   CrossStreet2: "BLOOMFIELD STREET",
    //   PostType:"TYPE CITY LIGHT ",
    //   PedestrianArm: false,
    //   NoArms: 4,
    //   PostColor: "Standard Green",
    //   LuminaireType: "CENTRAL PARK TYPE LUMINAIRE FOR TYPE B",
    //   TeardropType: "Type 5",
    //   AttachmentType1: "TAPERED OCTAGONAL LAMPPOST (8S)",
    //   AttachmentType2: "TYPE CITY LIGHT ",
    //   AttachmentType3: "Type Flushing Meadows Park Lamppost",
    // },
    // {
    //   FID: 2,
    //   Id:'Point-feature-ckfy8obt70a5p3a6wpx7nebaa',
    //   Comments: "5/14/2019",
    //   ImageID: "WE0OUAB2",
    //   ImageDat: "5/14/2019 12:42 PM",
    //   Link:"https://streetsmart.cyclomedia.com/streetsmart?q=986637.425003;206108.473332;2263",
    //   XY:"986637.425003,206108.473332",
    //   reminder:false,
    //   Section:"412B",
    //   OnStreet:"BETHUNE STREET",
    //   CrossStreet1: "DOWNING STREET",
    //   CrossStreet2: "BLOOMFIELD STREET",
    //   PostType:"TYPE CITY LIGHT ",
    //   PedestrianArm: false,
    //   NoArms: 4,
    //   PostColor: "Standard Green",
    //   LuminaireType: "CENTRAL PARK TYPE LUMINAIRE FOR TYPE B",
    //   TeardropType: "Type 5",
    //   AttachmentType1: "TAPERED OCTAGONAL LAMPPOST (8S)",
    //   AttachmentType2: "TYPE CITY LIGHT ",
    //   AttachmentType3: "Type Flushing Meadows Park Lamppost",
    // },
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

  //Delete Task 
  const deleteTask = (task) => {
    if (window.confirm("Are you sure you wish to delete this item?") == true)
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
    setSearched(true)
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
        setSearched(true)
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
    setSearched(true)
    console.log()
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

  const notify = () => toast.dark("Wow so easy !");

  return (

    <div className="container">
      <Header emptyEntry={() => setCurrentTask(emptyEntry)} 
      onAdd={()=> setShowDataForm(!showDataForm)}
      showDataForm={showDataForm}
    />
    
    {!searched && <div className='form-control'>
      <label>What District?</label>
      <input type ='text' placeholder='Input a District' 
      value={District} 
      onChange={(e) => setDistrict(e.target.value)}
      />
      <Button color='black' text='Retrieve' onClick = {retrieveData}/>
    </div>}

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

     {searched && <div className='form-control'>
      <label>Find another District</label>
      <input type ='text' placeholder='Input a District' 
      value={District} 
      onChange={(e) => setDistrict(e.target.value)}
      />
      <Button color='black' text='Retrieve' onClick = {retrieveData}/>
    </div>}


    <ToastContainer />
    </div>
  );
}

export default App;
