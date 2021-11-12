import {FaTimes} from 'react-icons/fa'


const Task = ({ task, onDelete, onToggle, onMouseDown }) => {
    return (
        <div className={`task ${task.reminder && 'reminder'}` } 
        onDoubleClick={()=> onToggle(task)}>
            <h3>
                {task.FID} 
                <FaTimes style={{cursor:'pointer'}}
                onClick={()=>onDelete(task)}
                onMouseDown={onMouseDown}
                />
            </h3>
            <p>{task.Link}</p>
            <p>{task.ImageID}</p>
            <p>{'Section: '+ task.Section}</p>
        </div>
    )
}

export default Task
