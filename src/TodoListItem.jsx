
function TodoListItem() {
    const{id, title} = todo;
    
    return(
        <li>
            {todo.title}
        </li>
    );
}

export default TodoListItem;