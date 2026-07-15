import { useState } from "react";

function TodoListItem() {
    const [todo, setTodo] = useState();
    
    return(
        <li>
            {todoList.map(todo => {todo.title})}
        </li>
    )
}

export default TodoListItem;