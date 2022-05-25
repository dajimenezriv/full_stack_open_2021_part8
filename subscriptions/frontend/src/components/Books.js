import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { ALL_BOOKS, ALL_GENRES } from 'queries';

function Books({ show }) {
  const [genre, setGenre] = useState(null);
  const books = useQuery(ALL_BOOKS, { variables: { genre }, pollInterval: 2000 });
  const genres = useQuery(ALL_GENRES);

  if (!show) return null;
  if (books.loading || genres.loading) return <div>loading...</div>;

  return (
    <div>
      <h2>books</h2>

      {(genre)
        ? (
          <div>
            in genre
            {' '}
            <b>{genre}</b>
          </div>
        ) : null}

      <table>
        <tbody>
          <tr>
            <th aria-label="empty" />
            <th>author</th>
            <th>published</th>
          </tr>
          {books.data.allBooks.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {genres.data.allGenres.map((g) => (
        <button key={g} type="button" onClick={() => setGenre(g)}>{g}</button>
      ))}
    </div>
  );
}

export default Books;
