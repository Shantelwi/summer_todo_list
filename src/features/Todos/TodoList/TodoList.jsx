
import { useMemo } from "react";
import TodoListItem from "./TodoListItem.jsx"

//add onCompleteTodo to the component's prop using destructuring. Pass the onCompleteTodo prop to each TodoListItem component instance.
function TodoList({ todoList, onCompleteTodo, onUpdateTodo,dataVersion }) {

    //create a filteredTodoList constant that filters out todos where isCompleted is true. Replace all reference to todoList in the jsx with filteredTodoList. Now when users check a todo's checkbox, it will disappear from the list as it's marked complete.
    const filteredTodoList = useMemo(() => {
        return {
            version:dataVersion, 
            todos:todoList.filter((todo) => !todo.isCompleted)};
        }, [todoList, dataVersion])

    return (
        //Add Ternary operator that checks if todoList length equals zero
        <>
            {filteredTodoList.todos.length === 0 ?
                <p>Add todo above to get started</p>
                :
                <ul>
                    {filteredTodoList.todos.map((todo) => {
                        return (
                            <TodoListItem
                                key={todo.id}
                                todo={todo}
                                onCompleteTodo={onCompleteTodo}
                                onUpdateTodo={onUpdateTodo}
                            />
                        )
                    })}
                </ul>
            }
        </>
    );
}

export default TodoList;