import { useEffect, useReducer } from "react";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList/TodoList";
import SortBy from "../../shared/SortBy";
import FilterInput from "../../shared/FilterInput";
import useDebounce from "../../utils/useDebounce";
import { todoReducer, initialTodoState, TODO_ACTIONS } from '../../reducers/todoReducer';
import { useAuth } from "../../contexts/AuthContext";

function TodosPage() {
  const { token } = useAuth();
  
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
  
  const debouncedFilterTerm = useDebounce(filterTerm, 300);
  
  const handleFilterChange = (newTerm) => {
    dispatch({
      type: TODO_ACTIONS.SET_FILTER,
      payload: {
        filterTerm: newTerm
      }
    })
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
          payload: { data: data.tasks}
        });

      } catch (error) {
        if (debouncedFilterTerm || sortBy !== 'createdAt' || sortDirection !== 'asc') {
          dispatch({
            type: TODO_ACTIONS.FETCH_ERROR,
            payload: {
              isFilterError: true,
              message: `Error filtering/sorting todos: ${error.message}`,
            }
          })
        } else {
          dispatch({
            type: TODO_ACTIONS.FETCH_ERROR,
            payload: {
              isFilterError: false,
              message: `Error fetching todos: ${error.message}`,
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
    //Transform the existing addTodo function to work with the API
    const newTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false
    };

    //optimistically add todo
    dispatch({
      type: TODO_ACTIONS.ADD_TODO_START,
      payload: {
        newTodo: newTodo
      }

    })

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

      dispatch({
        type: TODO_ACTIONS.ADD_TODO_SUCCESS,
        payload: {
          savedTodo: savedTodo,
          newTodo: newTodo
        }
      })

    } catch (error) {
      //Remove failed todo
      dispatch({
        type: TODO_ACTIONS.ADD_TODO_ERROR,
        payload: {
          newTodo: newTodo,
          error: error.message
        }
      })
    }
  }

  // completeTodo function: takes id parameter, maps through the todoList array, checks if each todo.id matches the provided id, if matches returns a new object that spreads the current todo and sets isCompleted to true
  async function completeTodo(id) {
    //Store the original todo for rollback
    const originalTodo = todoList.find(todo => todo.id === id);

    //Optimistically update the todo
    dispatch({
      type: TODO_ACTIONS.COMPLETE_TODO_START,
      payload: {
        id: id,
      }
    });

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

      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS
      })

    } catch (error) {
      //Rollback to the original todo
      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
        payload: {
          id: id,
          originalTodo: originalTodo,
          error: error.message
        }
      })
    }
  }

  //create an updateTodo function that: takes an editedTodo argument and maps through todos, comparing each todo.id with the updated todo's id.
  async function updateTodo(editedTodo) {
    //Store the original todo for rollback
    const originalTodo = todoList.find(todo => todo.id === editedTodo.id);

    //Optimistically update the todo
    dispatch({
      type: TODO_ACTIONS.UPDATE_TODO_START,
      payload: {
        editedTodo: editedTodo,
        originalTodo: originalTodo,

      }
    })

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

      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_SUCCESS
      })

    } catch (error) {
      //Rollback to the original todo
      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_ERROR,
        payload: {
          editedTodo: editedTodo,
          originalTodo: originalTodo,
          error: error.message
        }
      })
    }
  }

  return (
    <>
      {error && (
        <div>
          <p>{error}</p>
          <button onClick={() => dispatch({
            type: TODO_ACTIONS.CLEAR_ERROR
          })}
          >Clear Error</button>
        </div>
      )}

      {filterError && (
        <div>
          <p>{filterError}</p>
          <button onClick={() => dispatch({
            type: TODO_ACTIONS.CLEAR_FILTER_ERROR
          })}>
            Clear Filter Error
          </button>
          <button onClick={() => {
            dispatch({
              type: TODO_ACTIONS.RESET_FILTERS
            })
          }}>
            Reset Filters
          </button>
        </div>
      )}

      {isTodoListLoading && <p>Loading...</p>}
      <SortBy
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortByChange={(newSortBy) => {
          dispatch({
            type: TODO_ACTIONS.SET_SORT,
            payload: {
              sortBy: newSortBy
            }
          })
        }}
        onSortDirectionChange={(newSortDirection) => {
          dispatch({
            type: TODO_ACTIONS.SET_SORT,
            payload: {
              sortDirection: newSortDirection
            }
          })
        }}
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