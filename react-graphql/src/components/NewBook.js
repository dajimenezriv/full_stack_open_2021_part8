import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_BOOK, ALL_AUTHORS, ALL_GENRES } from 'queries';

function NewBook({ show, setMessage, setError }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [published, setPublished] = useState('');
  const [genre, setGenre] = useState('');
  const [genres, setGenres] = useState([]);

  const [addBook] = useMutation(ADD_BOOK, {
    onError: (err) => {
      setMessage(err.graphQLErrors[0].message);
      setTimeout(() => setMessage(''), 5000);
      setError(true);
    },
    onCompleted: (data) => {
      setTitle('');
      setPublished('');
      setAuthor('');
      setGenres([]);
      setGenre('');
    },
    // not working in query: ALL_BOOKS because the variable
    refetchQueries: [{ query: ALL_GENRES }, { query: ALL_AUTHORS }],
    /*
    not working when using variable genre in the query
    update: (cache, response) => {
      cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => ({
        allBooks: allBooks.concat(response.data.addBook),
      }));
    },
    */
  });

  if (!show) return null;

  const submit = async (event) => {
    event.preventDefault();

    addBook({
      variables: {
        title,
        author,
        published: parseInt(published, 10),
        genres,
      },
    });
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre('');
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>{`genres: ${genres.join(' ')}`}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
}

export default NewBook;
