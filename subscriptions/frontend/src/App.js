import React, { useState, useEffect } from 'react';
import {
  useQuery,
  useMutation,
  useSubscription,
  useApolloClient,
} from '@apollo/client';
import {
  ALL_BOOKS,
  BOOK_ADDED,
  LOGIN,
  ME,
} from 'queries';
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

  const me = useQuery(ME);
  const [login, result] = useMutation(LOGIN, {
    onError: (err) => {
      setMessage(err.graphQLErrors[0].message);
      setTimeout(() => setMessage(''), 5000);
      setError(true);
    },
  });

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const { bookAdded } = subscriptionData.data;
      setMessage(`'${bookAdded.title}' added`);
      setTimeout(() => setMessage(''), 5000);
      setError(false);

      /*
      // not working when using variable genre in the query
      client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => ({
        allBooks: allBooks.concat(bookAdded),
      }));
      */
    },
  });

  useEffect(() => {
    if (result.data) {
      setToken(result.data.login.value);
      localStorage.setItem('token', result.data.login.value);
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

  if (me.loading) return <div>loading...</div>;

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
      {(me.data.me)
        ? <Recommendation show={page === 'recommendations'} favouriteGenre={me.data.me.favouriteGenre} />
        : null}
    </div>
  );
}

export default App;
