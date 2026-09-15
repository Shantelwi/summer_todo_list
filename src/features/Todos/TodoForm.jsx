import { useRef, useState } from 'react';
import {isValidTodoTitle} from '../../utils/todoValidation.js'
import TextInputWithLabel from '../../shared/TextInputWithLabel.jsx';


function TodoForm({ onAddTodo }) {
    //add local state 
    const [workingTodoTitle, setWorkingTodoTitle] = useState("");
    const inputRef = useRef();

    const handleAddTodo = (e) => {
        e.preventDefault();
        onAddTodo(workingTodoTitle);
        setWorkingTodoTitle("");
        inputRef.current.focus();
    };

    return (
        <form onSubmit={handleAddTodo}>
            <TextInputWithLabel 
                inputRef={inputRef}
                value={workingTodoTitle}
                onChange = {(e) => {setWorkingTodoTitle(e.target.value)} }
                elementId = 'todoTitle'
                labelText = 'Todo'
            />
            <button 
                className='add-todo-button'
                type="submit"   
                disabled={!isValidTodoTitle(workingTodoTitle)} 
                >Add Todo
            </button> {/* add a disabled prop. set the disabled prop to true when workingTodoTitle is an empty string or contains only whitespace. */}
        </form>
    );
}

export default TodoForm;
