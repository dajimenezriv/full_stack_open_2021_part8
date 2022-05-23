/*
GraphQL parses automatically the __id param of MongoDb to id
*/

const { ApolloServer, UserInputError, AuthenticationError, gql } = require('apollo-server');
const mongoose = require('mongoose');
const Book = require('./models/book');
const Author = require('./models/author');
const User = require('./models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const MONGODB_URI = process.env.TEST_MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

console.log('connecting to', MONGODB_URI);

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message);
  });

const typeDefs = gql`
  type Author {
    name: String
    born: Int
    bookCount: Int!
    id: ID!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type User {
    username: String!
    favouriteGenre: String!
    id: ID!
  }
  
  type Token {
    value: String!
  }

  type Query {
    authorCount: Int!
    bookCount: Int!
    allAuthors: [Author!]!
    allBooks(author: String, genre: String): [Book!]!
    me: User
  }

  type Mutation {
    editAuthor(
      name: String!
      setBornTo: Int!  
    ): Author
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!
    createUser(
      username: String!
      favouriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`
// apollo server waits for the promise to resolve, and returns the result.
const resolvers = {
  Query: {
    authorCount: async () => await Author.collection.countDocuments(),
    bookCount: async () => await Book.collection.countDocuments(),
    allAuthors: async () => await Author.find({}),
    allBooks: async (root, args) => {
      res = await Book.find({}).populate('author');
      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        res = res.filter((b) => b.author.equals(author.id));
      }
      if (args.genre) res = res.filter((b) => b.genres.includes(args.genre));
      return res;
    },
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Mutation: {
    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) throw new AuthenticationError("not authenticated");
      const author = await Author.findOne({ name: args.name });
      if (!author) return null;
      author.born = args.setBornTo;

      try {
        return await author.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
    },
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) throw new AuthenticationError("not authenticated");
      const { author: authorName, ...otherArgs } = args;
      const author = await Author.findOne({ name: authorName });
      if (!author) new Author({ name: authorName }).save();
      try {
        return await new Book({ ...otherArgs, author }).save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
    },
    createUser: async (root, args) => {
      const user = new User({ ...args })

      return user.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') throw new UserInputError("wrong credentials");

      const userForToken = { username: user.username, id: user._id };
      return { value: jwt.sign(userForToken, JWT_SECRET) }
    },
  },
  Author: {
    bookCount: async (root) => {
      const author = await Author.find({ name: root.name });
      return (await Book.find({ author })).length;
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
