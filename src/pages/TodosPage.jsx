import { useEffect, useReducer } from "react";
import TodoForm from "../features/Todos/TodoForm";
import TodoList from "../features/Todos/TodoList/TodoList";
import SortBy from "../shared/SortBy";
import FilterInput from "../shared/FilterInput";
import useDebounce from "../utils/useDebounce";
import {
  todoReducer,
  initialTodoState,
  TODO_ACTIONS,
} from "../reducers/todoReducer";
import { useAuth } from "../contexts/AuthContext";
import { useSearchParams } from "react-router";
import StatusFilter from "../shared/StatusFilter";
import "../styles.css";

function TodosPage() {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get("status") || "all";
  const [state, dispatch] = useReducer(todoReducer, initialTodoState);

  const {
    todoList,
    error,
    filterError,
    isTodoListLoading,
    sortBy,
    sortDirection,
    filterTerm,
    dataVersion,
  } = state;

  const debouncedFilterTerm = useDebounce(filterTerm, 300);

  const handleFilterChange = (newTerm) => {
    dispatch({
      type: TODO_ACTIONS.SET_FILTER,
      payload: {
        filterTerm: newTerm,
      },
    });
  };

  useEffect(() => {
    async function fetchTodos() {
      try {
        dispatch({ type: TODO_ACTIONS.FETCH_START });

        const paramsObject = {
          sortBy,
          sortDirection,
          limit: 100,
        };
        if (debouncedFilterTerm) {
          paramsObject.find = debouncedFilterTerm.trim();
        }

        const params = new URLSearchParams(paramsObject);

        const response = await fetch(`/api/tasks?${params}`, {
          headers: {
            "X-CSRF-TOKEN": token,
          },
          credentials: "include",
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
          payload: { data: data.tasks },
        });
      } catch {
        if (
          debouncedFilterTerm ||
          sortBy !== "createdAt" ||
          sortDirection !== "asc"
        ) {
          dispatch({
            type: TODO_ACTIONS.FETCH_ERROR,
            payload: {
              error: "",
              filterError: 'Unable to load your todos. Please try again.',
            },
          });
        } else {
          dispatch({
            type: TODO_ACTIONS.FETCH_ERROR,
            payload: {
              error: 'Unable to load your todos. Please try again.',
              filterError: "",
            },
          });
        }
      }
    }

    if (token) {
      fetchTodos();
    }
  }, [token, sortBy, sortDirection, debouncedFilterTerm]);

  async function addTodo(todoTitle) {
    const newTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false,
    };

    const previousTodoList = todoList;

    dispatch({
      type: TODO_ACTIONS.ADD_TODO_START,
      payload: {
        newTodo: newTodo,
        previousTodoList: previousTodoList,
      },
    });

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": token,
        },
        credentials: "include",
        body: JSON.stringify({
          title: todoTitle,
          isCompleted: false,
        }),
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const savedTodo = await response.json();

      dispatch({
        type: TODO_ACTIONS.ADD_TODO_SUCCESS,
        payload: {
          savedTodo: savedTodo,
          newTodo: newTodo,
        },
      });
    } catch {
      dispatch({
        type: TODO_ACTIONS.ADD_TODO_ERROR,
        payload: {
          previousTodoList: previousTodoList,
          error: "Unable to add your todo. Please try again later",
        },
      });
    }
  }

  async function completeTodo(id) {
    const previousTodoList = todoList;
    dispatch({
      type: TODO_ACTIONS.COMPLETE_TODO_START,
      payload: {
        id: id,
        previousTodoList: previousTodoList,
      },
    });

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": token,
        },
        credentials: "include",
        body: JSON.stringify({
          isCompleted: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS,
      });
    } catch {
      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
        payload: {
          previousTodoList: previousTodoList,
          error: "Unable to complete your todo. Please try again.",
        },
      });
    }
  }

  async function updateTodo(editedTodo) {
    const previousTodoList = todoList;

    dispatch({
      type: TODO_ACTIONS.UPDATE_TODO_START,
      payload: {
        editedTodo: editedTodo,
        previousTodoList: previousTodoList,
      },
    });

    try {
      const response = await fetch(`/api/tasks/${editedTodo.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": token,
        },
        credentials: "include",
        body: JSON.stringify({
          title: editedTodo.title,
          isCompleted: editedTodo.isCompleted,
        }),
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_SUCCESS,
      });
    } catch {
      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_ERROR,
        payload: {
          previousTodoList: previousTodoList,
          error: "Unable to update your todo. Please try again.",
        },
      });
    }
  }

  return (
    <div className="todos-page">
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button
            onClick={() =>
              dispatch({
                type: TODO_ACTIONS.CLEAR_ERROR,
              })
            }
          >
            Clear Error
          </button>
        </div>
      )}

      {filterError && (
        <div className="error-message">
          <p>{filterError}</p>
          <button
            onClick={() =>
              dispatch({
                type: TODO_ACTIONS.CLEAR_FILTER_ERROR,
              })
            }
          >
            Clear Filter Error
          </button>
          <button
            onClick={() => {
              dispatch({
                type: TODO_ACTIONS.RESET_FILTERS,
              });
            }}
          >
            Reset Filters
          </button>
        </div>
      )}

      {isTodoListLoading && <p className="loading-message">Loading...</p>}

      <div className="todo-controls">
        <SortBy
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSortByChange={(newSortBy) => {
            dispatch({
              type: TODO_ACTIONS.SET_SORT,
              payload: {
                sortBy: newSortBy,
                sortDirection,
              },
            });
          }}
          onSortDirectionChange={(newSortDirection) => {
            dispatch({
              type: TODO_ACTIONS.SET_SORT,
              payload: {
                sortBy,
                sortDirection: newSortDirection,
              },
            });
          }}
        />

        <StatusFilter />

        <FilterInput
          filterTerm={filterTerm}
          onFilterChange={handleFilterChange}
        />
        <div className="search-bar">
          <TodoForm onAddTodo={addTodo} />
        </div>
      </div>
      
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        dataVersion={dataVersion}
        statusFilter={statusFilter}
      />
    </div>
  );
}
export default TodosPage;
