function TodoListItem({todo}) {

    const{title} = todo;

    return(
        //add onCompleteTodo to the component's prop using destructuring. Wrap the content inside the list item with an input element
        <li>
            <input 
                type="checkbox"
                checked={todo.isCompleted}
                onChange={() => onCompleteTodo(todo.id)} 
            />
            {todo.title}
        </li>
    )
}
export default TodoListItem;