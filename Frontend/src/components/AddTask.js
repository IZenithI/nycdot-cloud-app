import {useState} from 'react'
import Select, {createFilter, components} from 'react-select';
import WindowedSelect from "react-windowed-select";
const AddTask = ( {entry, onAdd, prop_types, prop_number, prop_color, prop_luminare, prop_attachment, prop_teardrop, prop_streets,streetObjects} ) => {


    const [FID, setFID] = useState(entry.FID)
    const [Id, setId] = useState(entry.Id)
    const [ImageID, setImageID] = useState(entry.ImageID)
    const [ImageDat, setImageDat] = useState(entry.ImageDat)
    const [Link, setLink] = useState(entry.Link)
    const [XY, setXY] = useState(entry.XY)
    const [Section, setSection] = useState(entry.Section)

    const [Comments, setComment] = useState(entry.Comments)
    const [OnStreet, setOnStreet] =useState(entry.OnStreet)
    const [CrossStreet1, setCrossStreet1] =useState(entry.CrossStreet1)
    const [CrossStreet2, setCrossStreet2] =useState(entry.CrossStreet2)

    const [PostType, setPostType] = useState(entry.PostType)
    const [PedestrianArm, setPedestrian] =useState(entry.PedestrianArm)
    const [NoArms, setNoArms] = useState(entry.NoArms)
    const [PostColor, setPostColor] = useState(entry.PostColor)
    const [LuminaireType, setLuminaireType] = useState(entry.LuminaireType)
    const [TeardropType, setTeardropType] = useState(entry.TeardropType)

    const [AttachmentType1, setAttachmentType1] =useState(entry.AttachmentType1)
    const [AttachmentType2, setAttachmentType2] = useState(entry.AttachmentType2)
    const [AttachmentType3, setAttachmentType3] = useState(entry.AttachmentType3)



    const handleOnStreetChange=(value)=> {

        if(!value)
        setOnStreet('')
        else 
        setOnStreet( value.value)
        //console.log(`Selected list:`, value.value);
      }

      const handleCrossStreet1Change=(value)=> {
        if(!value)
        setCrossStreet1('')
        else
        setCrossStreet1( value.value)
        //console.log(`Selected list:`, value.value);
      }

      const handleCrossStreet2Change=(value)=> {
        if(!value)
        setCrossStreet2('')
        else
        setCrossStreet2( value.value)        //console.log(`Selected list:`, value.value);
      }

    //console.log(objects)

    const onSubmit = (e) => {
        e.preventDefault()

        if(!Section){
            alert('Please select a section/district')
            return
        }

        if(!FID)
        {
            alert('Please select a FID')
            return
        }

        onAdd({FID,Id, ImageID, ImageDat, Link, XY, OnStreet, Comments, CrossStreet1, CrossStreet2,
             PostType, PedestrianArm,NoArms, PostColor,
             LuminaireType, TeardropType, AttachmentType1, AttachmentType2,AttachmentType3, Section
        })

    }

    return (
        
        <form className = 'add-form' onSubmit={onSubmit} 
        >
            <div className='form-control'>
                <label>FID</label>
                {
                    entry.FID == null ? (<input type ='text' placeholder='Add the FID' defaultValue='' onChange={(e) => setFID(e.target.value)}/>):
                    (<input type ='text'  readOnly = {true} defaultValue = {entry.FID}/> )  
                }
            </div>

            <div className='form-control'>
                <label>ID</label>
                {
                    entry.FID == null ? (<input type ='text' placeholder='Add the ID' defaultValue='' onChange={(e) => setId(e.target.value)}/>):
                    (<input type ='text'  readOnly = {true} defaultValue = {entry.Id}/> )  
                }
            </div>

            <div className='form-control'>
                <label>Comments</label>
                <input type ='text' placeholder='Add your comments' 
                 defaultValue={entry.Comments}
                 //value = {post_comments} 
                 onChange={(e) => setComment(e.target.value)}
                 />
            </div>

            <div className='form-control'>
                <label>ImageID</label>
                {
                    entry.FID == null ? (<input type ='text' placeholder='Add the ImageID' defaultValue='' onChange={(e) => setImageID(e.target.value)}/>):
                    (<input type ='text'  readOnly = {true} defaultValue = {entry.ImageID}/> )  
                }
            </div>

            <div className='form-control'>
                <label>ImageDate</label>
                {
                    entry.FID == null ? (<input type ='text' placeholder='Add the Image Data' defaultValue='' onChange={(e) => setImageDat(e.target.value)}/>):
                    (<input type ='text'  readOnly = {true} defaultValue = {entry.ImageDat}/> )  
                }
            </div>

            <div className='form-control'>
                <label>ImageLink</label>
                {
                    entry.FID == null ? (<input type ='text' placeholder='Add the Image link' defaultValue='' onChange={(e) => setLink(e.target.value)}/>):
                    (<input type ='text'  readOnly = {true} defaultValue = {entry.Link}/> )  
                }
            </div>
            
            <div className='form-control'>
                <label>XY</label>
                {
                    entry.FID == null ? (<input type ='text' placeholder='Add XY coordinates' defaultValue='' onChange={(e) => setXY(e.target.value)}/>):
                    (<input type ='text'  readOnly = {true} defaultValue = {entry.XY}/> )  
                }
            </div>

            <div className='form-control'>
                <label>Section</label>
                {
                    entry.FID == null ? (<input type ='text' placeholder='Add the Section' defaultValue='' onChange={(e) => setSection(e.target.value)}/>):
                    (<input type ='text'  readOnly = {true} defaultValue = {entry.Section}/> )  
                }
            </div>
            

            <div className='form-control form-control-check' >
                <label> On Street </label>
                {
                // <select value={OnStreet} defaultValue = {entry.OnStreet} onChange={(e) => setOnStreet(e.target.value) } >
                // <option value = "">None</option>
                //     {
                //         prop_streets.map((prop_streets,index) => <option key={index} 
                        
                //         value={prop_streets}>{prop_streets}</option>)
                //     }
                // </select>
                }

            </div>

            <WindowedSelect
            options={streetObjects}
            // options ={prop_streets}
            // getOptionLabel={option => option} 
            // getOptionValue={option => option}
            isSearchable
            isClearable 
            defaultValue = {{label: entry.OnStreet, value: entry.OnStreet}}
            onChange={handleOnStreetChange}
            filterOption={createFilter({ignoreAccents: false})}
            placeholder={'Select a Street'}
            />


            <div className='form-control form-control-check'>
                <label> Cross Street 1 </label>
               { 
            //    <select value={CrossStreet1}  defaultValue = {entry.CrossStreet1} onChange={(e) => setCrossStreet1(e.target.value)} >
            //     <option value = "">None</option>
            //         {
            //             prop_streets.map((prop_streets,index) => <option key={index} value={prop_streets}>{prop_streets}</option>)
            //         }
            //     </select>
                }
            </div>

            <WindowedSelect
            options={streetObjects}
            isSearchable
            isClearable
            defaultValue = {{label: entry.CrossStreet1, value: entry.CrossStreet1}}
            onChange={handleCrossStreet1Change}
            filterOption={createFilter({ignoreAccents: false})}
            placeholder={'Select a Street'}
            />

            <div className='form-control form-control-check'>
                <label> Cross Street 2 </label>
                {                
                // <select value={CrossStreet2}  defaultValue = {entry.CrossStreet2} onChange={(e) => setCrossStreet2(e.target.value)} >
                // <option value = "">None</option>
                //     {
                //         prop_streets.map((prop_streets,index) => <option key={index} value={prop_streets}>{prop_streets}</option>)
                //     }
                // </select>
                }
            </div>

            <WindowedSelect
            options={streetObjects}
            isSearchable
            isClearable
            defaultValue = {{label: entry.CrossStreet2, value: entry.CrossStreet2}}
            onChange={handleCrossStreet2Change}
            filterOption={createFilter({ignoreAccents: false})}
            placeholder={'Select a Street'}

            />

            <div className='form-control form-control-check'>
                <label> Type of Post  </label>
                <select value={PostType}  defaultValue = {entry.PostType} onChange={(e) => setPostType(e.target.value)} >
                <option value = "">None</option>
                    { prop_types.map((prop_types,index) => <option key={index} value={prop_types}>{prop_types}</option>)}
                </select>
            </div>

            
            <div className='form-control form-control-check'>
                <label>Pedestrian Arm </label>
                <input type ='checkbox' 
                defaultChecked = {false}
                 value={PedestrianArm} 
                 //checked={post_pedestrian_arm}
                 onChange={(e) => setPedestrian(e.currentTarget.checked)}
                 />  
            </div>


            <div className='form-control form-control-check'>
                <label> Number of arms </label>
                <select value={NoArms}  defaultValue = {entry.NoArms} onChange={(e) => setNoArms(e.target.value)} >
                <option value = "0">0</option>
                    {
                        prop_number.map((prop_number,index) => <option key={index} value={prop_number}>{prop_number}</option>)
                    }
                </select>
            </div>

            <div className='form-control form-control-check'>
                <label> Post Color  </label>
                <select value={PostColor}  defaultValue = {entry.PostColor} onChange={(e) => setPostColor(e.target.value)} >
                    {
                        prop_color.map((prop_color,index) => <option key={index} value={prop_color}>{prop_color}</option>)
                    }
                </select>
            </div>

            <div className='form-control form-control-check'>
                <label> Post Luminare  </label>
                <select value={LuminaireType}  defaultValue = {entry.LuminaireType} onChange={(e) => setLuminaireType(e.target.value)} >
                <option value = "">None</option>
                    {
                        prop_luminare.map((prop_luminare,index) => <option key={index} value={prop_luminare}>{prop_luminare}</option>)
                    }
                </select>
            </div>

            <div className='form-control form-control-check'>
                <label> Teardrop Type </label>
                <select value={TeardropType}  defaultValue = {entry.TeardropType} onChange={(e) => setTeardropType(e.target.value)} >
                <option value = "">None</option>
                    {
                        prop_teardrop.map((prop_teardrop,index) => <option key={index} value={prop_teardrop}>{prop_teardrop}</option>)
                    }
                </select>
            </div>


            <div className='form-control form-control-check'>
                <label> Attachment Type 1  </label>
                <select value={AttachmentType1}  defaultValue = {entry.AttachmentType1} onChange={(e) => setAttachmentType1(e.target.value)} >
                <option value = "">None</option>

                    {
                        prop_attachment.map((prop_attachment,index) => <option key={index} value={prop_attachment}>{prop_attachment}</option>)
                    }
                </select>
            </div>

            <div className='form-control form-control-check'>
                <label> Attachment Type 2  </label>
                <select value={AttachmentType2}  defaultValue = {entry.AttachmentType2} onChange={(e) => setAttachmentType2(e.target.value)} >
                <option value = "">None</option>
                    {
                        prop_attachment.map((prop_attachment,index) => <option key={index} value={prop_attachment}>{prop_attachment}</option>)
                    }
                </select>
            </div>

            <div className='form-control form-control-check'>
                <label> Attachment Type 3  </label>
                <select value={AttachmentType3}  defaultValue = {entry.AttachmentType3} onChange={(e) => setAttachmentType3(e.target.value)} >
                <option value = "">None</option>
                    {
                        prop_attachment.map((prop_attachment,index) => <option key={index} value={prop_attachment}>{prop_attachment}</option>)
                    }
                </select>
            </div>



                        

            <input type='submit' value='Save Streetlight Data'
            className='btn btn-block' />
        </form>
    )
}

export default AddTask

