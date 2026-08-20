import { useState } from 'react';
import './App.css'
import Logon from './features/Logon';
import TodosPage from './features/Todos/TodosPage';
import Header from './shared/Header';

function App() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  return (
    <div>
      <Header
        token={token}
        email={email}
        onSetToken = {setToken}
        onSetEmail = {setEmail}
      />

      {token ? (
        <TodosPage
          token={token}
        />
      ) : (
        <Logon onSetEmail={setEmail} onSetToken={setToken} />
      )}
    </div>
  );

}

export default App
