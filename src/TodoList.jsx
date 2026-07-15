import TodoListItem from "./TodoListItem.jsx";

function TodoList({todoList}) {
    return (
        <ul>
            {todoList.map(todo => <TodoListItem key={todo.id} prop={todo.title}/>)}
        </ul>
    );
}

export default TodoList;