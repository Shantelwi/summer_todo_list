import './App.css'
import Logon from './features/Logon';
import TodosPage from './features/Todos/TodosPage';
import Header from './shared/Header';
import { useAuth } from './contexts/AuthContext';
import Logoff from './features/Logoff';

function App() {
  const { isAuthenticated } = useAuth();
  return (
    <div>
      <Header />

      {isAuthenticated ? (
        <>
          <Logoff />
          <TodosPage />
        </>
      ) : (
        <Logon />
      )}
    </div>
  );

}

export default App
