
import { useMemo } from "react";
import TodoListItem from "./TodoListItem.jsx"

//add onCompleteTodo to the component's prop using destructuring. Pass the onCompleteTodo prop to each TodoListItem component instance.
function TodoList({ todoList, onCompleteTodo, onUpdateTodo, dataVersion, statusFilter = 'active' }) {

    //create a filteredTodoList constant that filters out todos where isCompleted is true. Replace all reference to todoList in the jsx with filteredTodoList. Now when users check a todo's checkbox, it will disappear from the list as it's marked complete.
    const filteredTodoList = useMemo(() => {

        let filteredTodos;
        switch (statusFilter) {
            case 'completed':
                filteredTodos = todoList.filter((todo) => todo.isCompleted);
                break;
            case 'active':
                filteredTodos = todoList.filter((todo) => !todo.isCompleted);
                break;
            case 'all':
            default:
                filteredTodos = todoList;
                break;
        }
        return {
            version: dataVersion,
            todos: filteredTodos
        };
    }, [todoList, dataVersion, statusFilter]);

    const getEmptyMessage = () => {
        switch (statusFilter) {
            case 'completed':
                return 'No completed todos yet. Complete some tasks to see them here.';
            case 'active':
                return 'No active todos. Add a todo above to get started.';
            case 'all':
            default:
                return 'Add todo above to get started.';
        }
    };

    return filteredTodoList.todos.length === 0 ? (
        <p>{getEmptyMessage()}</p>
    ) : (
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
    )
}

export default TodoList;