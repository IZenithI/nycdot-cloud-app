import Task from './Task'

const Tasks = ({ tasks, onDelete, onToggle, onMouseDown, reminders}) => {
    return (
        <>
        {tasks.map((task) => (
            <Task 
            key={task.FID}
            task={task}
            onDelete = {onDelete} 
            onToggle={onToggle}
            onMouseDown={onMouseDown}
            reminders={reminders}
            
            />
        ))}
            
        </>
    )
}

export default Tasks
