
import TodoListItem from "./TodoListItem.jsx"

function TodoList({ todoList }) {

    return (
        //Add Ternary operator that checks if todoList length equals zero
        <>
            {todoList.length === 0 ?
                <p>Add Todo above to get started!</p>
                :
                <ul>
                    {todoList.map((todo) => {
                        return (
                            <TodoListItem key={todo.id} todo={todo} />
                        )
                    })}
                </ul>
            }
        </>
    );
}

export default TodoList;