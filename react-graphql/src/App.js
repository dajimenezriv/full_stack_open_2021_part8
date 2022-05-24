import React, { useState, useEffect } from 'react';
import { useMutation, useApolloClient } from '@apollo/client';
import { LOGIN } from 'queries';
import Notification from 'components/Notification';
import LoginForm from 'components/LoginForm';
import Recommendation from 'components/Recommendation';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';

function App() {
  const [page, setPage] = useState('authors');
  const [token, setToken] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(true);
  const client = useApolloClient();

  const [login, result] = useMutation(LOGIN, {
    onError: (err) => {
      setMessage(err.graphQLErrors[0].message);
      setTimeout(() => setMessage(''), 5000);
      setError(true);
    },
  });

  useEffect(() => {
    if (result.data) {
      setToken(result.data.login.value);
      localStorage.setItem('token', result.data.login.value);
      localStorage.setItem('favouriteGenre', result.data.login.favouriteGenre);
      setPage('authors');
    }
  }, [result.data]); // eslint-disable-line

  const handleLogin = (username, password) => {
    login({ variables: { username, password } });
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  return (
    <div>
      <div>
        <button type="button" onClick={() => setPage('authors')}>authors</button>
        <button type="button" onClick={() => setPage('books')}>books</button>
        {
          (!token)
            ? <button type="button" onClick={() => setPage('login')}>login</button>
            : (
              <>
                <button type="button" onClick={() => setPage('add')}>add book</button>
                <button type="button" onClick={() => setPage('recommendations')}>recommendations</button>
                <button type="button" onClick={handleLogout}>logout</button>
              </>
            )
        }
      </div>

      <Notification message={message} error={error} />
      <Authors show={page === 'authors'} />
      <Books show={page === 'books'} />
      <NewBook show={page === 'add'} setMessage={setMessage} setError={setError} />
      <LoginForm show={page === 'login'} handleLogin={handleLogin} />
      <Recommendation show={page === 'recommendations'} />
    </div>
  );
}

export default App;
