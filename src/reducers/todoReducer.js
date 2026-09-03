export const TODO_ACTIONS = {
    //Fetch operations (async)
    FETCH_START: 'FETCH_START',
    FETCH_SUCCESS: 'FETCH_SUCCESS',
    FETCH_ERROR: 'FETCH_ERROR',

    //Add todo operations
    ADD_TODO_START: 'ADD_TODO_START',
    ADD_TODO_SUCCESS: 'ADD_TODO_SUCCESS',
    ADD_TODO_ERROR: 'ADD_TODO_ERROR',

    COMPLETE_TODO: 'COMPLETE_TODO',
    UPDATE_TODO: 'UPDATE_TODO',

    //UI operations
    SET_SORT: 'SET_SORT',
    SET_FILTER: 'SET_FILTER',
    CLEAR_ERROR: 'CLEAR_ERROR',
    RESET_FILTERS: 'RESET_FILTERS'
}

//transform all useState calls into a single state object
export const initialTodoState = {
    todoList: [],
    error: '',
    filterError: '',
    isTodoListLoading: true,
    sortBy: 'createdAt',
    sortDirection: 'asc',
    filterTerm: '',
    dataVersion: 0
};

//Implement a reducer that handles each action type

export function todoReducer(state, action) {
    switch (action.type) {
        case TODO_ACTIONS.FETCH_START:
            return {
                ...state,
                isTodoListLoading: true,
                error: '',
                filterError: ''
            };

        case TODO_ACTIONS.FETCH_SUCCESS:
            return {
                ...state,
                isTodoListLoading: false,
                todoList: action.tasks,
                error: '',
                filterError: ''
            };

        case TODO_ACTIONS.FETCH_ERROR:
            return {
                ...state,
                isTodoListLoading: false,
                error: `Error fetching todos: ${action.message}`,
                filterError: ''
            }

        case TODO_ACTIONS.ADD_TODO_START:
            return {
                ...state,
                todoList: [action.newTodo, ...state.todoList],
                error: ''
            }

        case TODO_ACTIONS.ADD_TODO_SUCCESS:
            return {
                ...state,
                todoList: state.todoList.map(todo => todo.id === action.newTodo.id ? action.savedTodo : todo),
                error: ''
            }

        case TODO_ACTIONS.ADD_TODO_ERROR:
            return {
                ...state,
                todoList: state.todoList.filter(todo => todo.id !== action.newTodo.id),
                error: `Error: ${action.message}`
            }

        case TODO_ACTIONS.COMPLETE_TODO:
            return {
                ...state,
                todoList: state.todoList.map(
                    todo => todo.id === action.id 
                    ? {...todo, isCompleted:true} 
                    : todo),
                error: '',
            }

        case TODO_ACTIONS.UPDATE_TODO:
            return {
                ...state,
                todoList: state.todoList.map(
                    todo => todo.id === action.editedTodo.id 
                    ? { ...todo, ...action.editedTodo}
                    : todo),
                error: ''
            }

        case TODO_ACTIONS.SET_SORT:
            return {
                ...state,
                sortBy: action.sortBy,
                sortDirection: action.sortDirection
            }

        case TODO_ACTIONS.SET_FILTER:
            return {
                ...state,
                filterTerm: action.filterTerm
            }

        case TODO_ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                filterError: ''
            }

        case TODO_ACTIONS.RESET_FILTERS:
            return {
                ...state,
                filterTerm: '',
                sortBy: 'createdAt',
                sortDirection: 'asc',
                filterError: ''
            }
    
        default:
            throw new Error(`Unknown action type: ${ action.type } `);
    }
}