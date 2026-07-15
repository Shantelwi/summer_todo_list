import TodoListItem from "./TodoListItem.jsx";

function TodoList({ todoList }) {
    return (
        <ul>
            {todoList.map((todo) => {
                return (
                    <TodoListItem key={todo.id} baseTitle={todo.title}
                    />
                )
                })}
        </ul>
    );
}

export default TodoList;