import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { ALL_AUTHORS, EDIT_AUTHOR } from 'queries';

function Authors({ show }) {
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [born, setBorn] = useState('');

  const authors = useQuery(ALL_AUTHORS);
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  if (!show) return null;
  if (authors.loading) return <div>loading...</div>;

  const handleEditAuthor = () => {
    if (!selectedAuthor || born === '') return;
    editAuthor({
      variables: {
        name: selectedAuthor,
        setBornTo: parseInt(born, 10),
      },
    });
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th aria-label="empty" />
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.data.allAuthors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>birthyear</h2>
      <form>
        <select defaultValue="blank" onChange={(e) => setSelectedAuthor(e.target.value)}>
          <option disabled value="blank"> -- select an option -- </option>
          {authors.data.allAuthors.map((a) => (
            <option key={a.id} value={a.name}>{a.name}</option>
          ))}
        </select>
        <div>
          born
          <input type="number" value={born} onChange={(e) => setBorn(e.target.value)} />
        </div>
        <button type="button" onClick={handleEditAuthor}>update author</button>
      </form>
    </div>
  );
}

export default Authors;
