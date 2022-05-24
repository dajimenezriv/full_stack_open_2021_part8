import React from 'react';
import { useQuery } from '@apollo/client';
import { ALL_BOOKS } from 'queries';

function Recommendation({ show }) {
  const genre = localStorage.getItem('favouriteGenre');
  const books = useQuery(ALL_BOOKS, {
    pollInterval: 2000,
    variables: { genre },
  });

  if (!show) return null;
  if (books.loading) return <div>loading...</div>;

  return (
    <div>
      <h2>recommendations</h2>

      {(genre)
        ? (
          <div>
            books in your favorite genre
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
    </div>
  );
}

export default Recommendation;
