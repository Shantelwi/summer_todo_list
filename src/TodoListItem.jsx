
function TodoListItem(todo) {
    const{title} = todo;

    return (
        <li>
            {todo.title}
        </li>
    );
}

export default TodoListItem;