import { useState } from "react";
import TodoList from "./features/TodoList/TodoList.jsx";
import TodoForm from "./features/TodoForm.jsx";
import './App.css'

function App() {
  function addTodo(todoTitle) {
    const newTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false
    };
    setTodoList(previous => [newTodo, ...previous]);
  }

  const [todoList, setTodoList] = useState([]);

  // completeTodo function: takes id parameter, maps through the todoList array, checks if each todo.id matches the provided id, if matches returns a new object that spreads the current todo and sets isCompleted to true
  function completeTodo(id) {
    const updatedList = todoList.map((todo) => {
      if (todo.id === id) {
        return (
          { ...todo, isCompleted: true }
        )  
        } else {
          return todo;
        }
      });
      setTodoList(updatedList);
    }

    //create an updateTodo function that: takes an editedTodo argument and maps through todos, comparing each todo.id with the updated todo's id.
    function updateTodo(editedTodo) {
      const updatedTodos = todoList.map((todo) => {
        if (todo.id === editedTodo.id) {
          return(
            {...todo, ...editedTodo}
          )
        } else {
          return todo;
        }
      });
      setTodoList(updatedTodos);
    }

  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo}/>
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo}/> { /*add an onCompleteTodo prop to the TodoList component, passing in your completeTodo functioon  */}
    </div>
  );

}

export default App
