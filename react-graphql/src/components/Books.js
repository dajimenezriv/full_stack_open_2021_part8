import React from 'react';
import { useQuery } from '@apollo/client';
import { ALL_BOOKS } from 'queries';

function Books({ show }) {
  const books = useQuery(ALL_BOOKS, { pollInterval: 2000 });

  if (!show) return null;
  if (books.loading) return <div>loading...</div>;

  return (
    <div>
      <h2>books</h2>

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
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Books;
