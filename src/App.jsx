import './App.css'
import TodosPage from './features/Todos/TodosPage';
import Header from './shared/Header';

function App() {
  return (
    <div>
      <Header/>
      <TodosPage/>
      <TodoForm onAddTodo={addTodo}/>
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo}/> { /*add an onCompleteTodo prop to the TodoList component, passing in your completeTodo functioon  */}
    </div>
  );

}

export default App
