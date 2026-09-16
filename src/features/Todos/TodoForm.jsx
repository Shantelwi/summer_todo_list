import { useRef, useState } from 'react';
import {isValidTodoTitle} from '../../utils/todoValidation.js'
import TextInputWithLabel from '../../shared/TextInputWithLabel.jsx';


function TodoForm({ onAddTodo }) {
    const [workingTodoTitle, setWorkingTodoTitle] = useState("");
    const inputRef = useRef();

    const handleAddTodo = (e) => {
        e.preventDefault();

        if (!isValidTodoTitle(workingTodoTitle)) {
            return;
        }
        
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
            </button> 
        </form>
    );
}

export default TodoForm;
