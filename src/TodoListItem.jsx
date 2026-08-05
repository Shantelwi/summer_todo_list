function TodoListItem({todo, onCompleteTodo}) {

    const{title} = todo;

    return(
        //add onCompleteTodo to the component's prop using destructuring. Wrap the content inside the list item with an input element
        <ul>
            <input 
                type="checkbox"
                checked={todo.isCompleted}
                onChange={() => onCompleteTodo(todo.id)} 
            />
            {todo.title}
        </ul>
    )
}
export default TodoListItem;