import { useEffect, useState } from "react";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList/TodoList";
import SortBy from "../../shared/SortBy";

function TodosPage({ token }) {

  //add two new state variables after the existing state: sortBy with initial value of 'createdAt' and sortDirection with the initial value of 'desc'
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');


  const [todoList, setTodoList] = useState([]);

  //add state variables for error(for displaying API errors, default empty string) and isTodoLoading(for showing loading state, default false)
  const [error, setError] = useState("");
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);

  useEffect(() => {
    async function fetchTodos() {
      try {
        setIsTodoListLoading(true);
        const params = new URLSearchParams({
          sortBy,
          sortDirection,
          limit: 100
        });
        const response = await fetch(`/api/tasks?${params}`, {
          headers: {
            'X-CSRF-TOKEN': token
          },
          credentials: 'include'
        });

        if (response.status === 401) {
          throw new Error("unauthorized");
        }
        if (!response.ok) {
          throw new Error("Something went wrong");
        }

        const data = await response.json();

        setTodoList(data.tasks);

      } catch (error) {
        setError(`Error: ${error.message}`)
      } finally {
        setIsTodoListLoading(false);
      }
    }

    if (token) {
      fetchTodos()
    };
  }, [token, sortBy, sortDirection]);

  async function addTodo(todoTitle) {
    setError("");
    //Transform the existing addTodo function to work with the API
    const newTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false
    };

    //optimistically add todo
    setTodoList(previous => [newTodo, ...previous]);

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token
        },
        credentials: 'include',
        body: JSON.stringify({
          title: todoTitle,
          isCompleted: false
        })
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const savedTodo = await response.json();

      //replace temporary todo with the real server todo

      setTodoList(previous =>
        previous.map(todo =>
          todo.id === newTodo.id ? savedTodo : todo
        )
      );

    } catch (error) {
      //Remove failed todo
      setTodoList(previous =>
        previous.filter(todo => todo.id !== newTodo.id)
      );
      setError(`Error: ${error.message}`);
    }
  }


  // completeTodo function: takes id parameter, maps through the todoList array, checks if each todo.id matches the provided id, if matches returns a new object that spreads the current todo and sets isCompleted to true
  async function completeTodo(id) {
    setError("");
    //Store the original todo for rollback
    const originalTodo = todoList.find(todo => todo.id === id);

    if (!originalTodo) {
      setError("Todo not found");
      return;
    }

    //Optimistically update the todo
    setTodoList(previous =>
      previous.map(todo =>
        todo.id === id
          ? { ...todo, isCompleted: true }
          : todo
      )
    );

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token
        },
        credentials: 'include',
        body: JSON.stringify({
          isCompleted: true
        })
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      //Rollback to the original todo
      setTodoList(previous =>
        previous.map(todo => 
          todo.id === id ? originalTodo : todo
        )
      );
      setError(`Error: ${error.message}`);
    }
  }

  //create an updateTodo function that: takes an editedTodo argument and maps through todos, comparing each todo.id with the updated todo's id.
  async function updateTodo(editedTodo) {
    setError("");
        //Store the original todo for rollback
    const originalTodo = todoList.find(todo => todo.id === editedTodo.id);

    if (!originalTodo) {
      setError("Todo not found");
      return;
    }

    //Optimistically update the todo
    setTodoList(previous =>
      previous.map(todo =>
        todo.id === editedTodo.id
          ? { ...todo, ...editedTodo }
          : todo
      )
    );

    try {
      const response = await fetch(`/api/tasks/${editedTodo.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token
        },
        credentials: 'include',
        body: JSON.stringify({
          title: editedTodo.title,
          isCompleted: editedTodo.isCompleted
        })
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      //Rollback to the original todo
      setTodoList(previous =>
        previous.map(todo => 
          todo.id === editedTodo.id ? originalTodo : todo
        )
      );
      setError(`Error: ${error.message}`);
    }
  }

  return (
    <>
        {error && (
          <div>
            <p>{error}</p>
            <button onClick={() => setError("")}>Clear Error</button>  
          </div>
        )
      }
      {isTodoListLoading && <p>Loading...</p>}
      <SortBy
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortByChange={setSortBy}
        onSortDirectionChange={setSortDirection}
      />
      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo} /> { /*add an onCompleteTodo prop to the TodoList component, passing in your completeTodo functioon  */}
    </>
  )
}

export default TodosPage;