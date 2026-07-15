import TodoListItem from "./TodoListItem.jsx";

function TodoList({ todoList }) {
    const todos = [
  { id: 1, title: "review resources" },
  { id: 2, title: "take notes" },
  { id: 3, title: "code out app" }
]
    return (

        <ul>
            {todoList.map((todo) => {
                return (
                    <li key={todo.id}>{todo.title}</li>
                )
                })}
        </ul>
    );
}

export default TodoList;