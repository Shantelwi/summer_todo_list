
import TodoListItem from "./TodoListItem.jsx"


//add onCompleteTodo to the component's prop using destructuring. Pass the onCompleteTodo prop to each TodoListItem component instance.
function TodoList({ todoList, onCompleteTodo }) {

    //create a filteredTodoList constant that filters out todos where isCompleted is true. Replace all reference to todoList in the jsx with filteredTodoList. Now when users check a todo's checkbox, it will disappear from the list as it's marked complete.
    const filteredTodoList = todoList.filter((todo) => {
        return (
            todo.isCompleted ? false : true
        )
    });

    return (
        //Add Ternary operator that checks if todoList length equals zero
        <>
            {filteredTodoList.length === 0 ?
                <p>Add Todo above to get started</p>
                :
                <ul>
                    {filteredTodoList.map((todo) => {
                        return (
                            <TodoListItem
                                key={todo.id}
                                todo={todo}
                                onCompleteTodo={onCompleteTodo}
                            />
                        )
                    })}
                </ul>
            }
        </>
    );
}

export default TodoList;