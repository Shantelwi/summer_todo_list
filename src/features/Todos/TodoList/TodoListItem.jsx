import TextInputWithLabel from '../../../shared/TextInputWithLabel.jsx';
import { useState, useRef } from 'react';
import { isValidTodoTitle } from '../../../utils/todoValidation.js';

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo}) {

    const inputRef = useRef();

    const [isEditing, setIsEditing] = useState(false);
    const [workingTitle, setWorkingTitle] = useState(todo.title);

    function handleCancel() {
        setWorkingTitle(todo.title);
        setIsEditing(false);
    }

    function handleEdit(event) {
        setWorkingTitle(event.target.value);
    }

    function handleUpdate(event) {
        if (!isEditing) {
            return;
        }
        event.preventDefault();

        if (!isValidTodoTitle(workingTitle)) {
            return;
        }

        onUpdateTodo({ ...todo, title: workingTitle });
        setIsEditing(false);
    }

    return (
        <li>
            <form onSubmit={handleUpdate}>
                {isEditing ? (
                    <>
                        <TextInputWithLabel
                            value={workingTitle}
                            onChange={handleEdit}
                            elementId={`edit${todo.id}`}
                            labelText='Todo'
                            inputRef={inputRef}
                        />
                        <button type='button' onClick={handleCancel}>Cancel</button>
                        <button type='button' onClick={handleUpdate}>Update</button>
                    </>
                ) : (
                    <>
                        <label>
                            <input
                                type="checkbox"
                                id={`checkbox${todo.id}`}
                                checked={todo.isCompleted}
                                onChange={() => onCompleteTodo(todo.id)}
                            />
                        </label>
                        <span onClick={() => setIsEditing(true)}> {todo.title} </span>
                    </>
                )}
            </form>
        </li>

    )
}
export default TodoListItem;