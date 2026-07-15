import { useState } from "react";

function TodoListItem() {
    const [todo, setTodo] = useState();
    
    return(
       <>
            {todoList.map(todo => {todo.title})}
       </>
        
    )
}

export default TodoListItem;