import { gql } from '@apollo/client';

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      id,
      name,
      born,
      bookCount
    }
  }
`;

export const EDIT_AUTHOR = gql`
mutation EditAuthor($name: String!, $setBornTo: Int!) {
  editAuthor(name: $name, setBornTo: $setBornTo) {
    name
    born
  }
}
`;

export const ALL_BOOKS = gql`
query {
  allBooks {
    id,
    title,
    author,
    published
  }
}
`;

export const ADD_BOOK = gql`
mutation AddBook($title: String!, $published: Int!, $genres: [String!]!, $author: String!) {
  addBook(title: $title, published: $published, genres: $genres, author: $author) {
    title
  }
}
`;
