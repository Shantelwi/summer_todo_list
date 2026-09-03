import { useCallback, useEffect, useState, useReducer } from "react";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList/TodoList";
import SortBy from "../../shared/SortBy";
import FilterInput from "../../shared/FilterInput";
import useDebounce from "../../utils/useDebounce";
import {todoReducer, initialTodoState, TODO_ACTIONS} from '../../reducers/todoReducer';

function TodosPage({ token }) {

  const debouncedFilterTerm = useDebounce(filterTerm, 300);
  
  //replace all useState calls with useReducer and destructuring useReducer's state
  const [state, dispatch] = useReducer(todoReducer, initialTodoState);

  const {
    todoList,
    error,
    filterError,
    isTodoListLoading,
    sortBy,
    sortDirection,
    filterTerm,
    dataVersion
  } = state;

  //Add cache invalidation state
  //create cache invalidation function
  const invalidateCache = useCallback(() => {
    setDataVersion(prev => prev + 1);
  }, [])

  //Create filter handler function that accepts new filter term and calls setFilterTerm
  const handleFilterChange = (newTerm) => {
    setFilterTerm(newTerm);
  };

  useEffect(() => {
    //update fetchTodos function to include filter when present
    async function fetchTodos() {
      try {
        dispatch({ type: TODO_ACTIONS.FETCH_START });

        const paramsObject = {
          sortBy,
          sortDirection,
          limit: 100
        };
        if (debouncedFilterTerm) {
          paramsObject.find = debouncedFilterTerm;
        }

        const params = new URLSearchParams(paramsObject);

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

        dispatch({
          type: TODO_ACTIONS.FETCH_SUCCESS,
          payload: {data}
        });

      } catch (error) {
        if (debouncedFilterTerm || sortBy !== 'createdAt' || sortDirection !== 'asc') {
          dispatch({
            type: TODO_ACTIONS.FETCH_ERROR,
            payload:{
              message: `Error filtering/sorting todos: ${error.message}`
            }
          });
        } else {
          dispatch ({
            type: TODO_ACTIONS.FETCH_ERROR,
            payload: {
              message:`Error fetching todos: ${error.message}`,
              isFilterError: false 
            }
          })
        }
      }
    }

    if (token) {
      fetchTodos()
    };
  }, [token, sortBy, sortDirection, debouncedFilterTerm]);

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

      invalidateCache();

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
      invalidateCache();

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

      invalidateCache();

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
      )}
      
      {filterError && (
        <div>
          <p>{filterError}</p>
          <button onClick={() => setFilterError('')}>
            Clear Filter Error
          </button>
          <button onClick={() => {
            setFilterTerm('');
            setSortBy('createdAt')
            setSortDirection('asc')
            setFilterError('')
          }}>
            Reset Filters
          </button>
        </div>
      )}

      {isTodoListLoading && <p>Loading...</p>}
      <SortBy
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortByChange={setSortBy}
        onSortDirectionChange={setSortDirection}
      />
      <FilterInput
        filterTerm={filterTerm}
        onFilterChange={handleFilterChange}
      />
      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo} /*add an onCompleteTodo prop to the TodoList component, passing in your completeTodo functioon  */
        onUpdateTodo={updateTodo}
        dataVersion={dataVersion} />
    </>
  )
}
export default TodosPage;