import './App.css';
import { Routes, Route } from 'react-router';
import Logon from './features/Logon';
import TodosPage from './pages/TodosPage';
import Header from './shared/Header';
import { useAuth } from './contexts/AuthContext';
import Logoff from './features/Logoff';

function App() {
  return (
    <>
      <Header />

      {isAuthenticated ? (
        <>
          <Logoff />
          <TodosPage />
        </>
      ) : (
        <Logon />
      )}
    </
    
    
    >
  );

}

export default App
