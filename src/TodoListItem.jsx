
function TodoListItem({todo}) {
    const {id, title} = todo;
    return (
        <li>
            {todo.title}
        </li>
    );
}

export default TodoListItem;