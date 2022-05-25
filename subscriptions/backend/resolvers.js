const { UserInputError, AuthenticationError } = require('apollo-server');
const { PubSub } = require('graphql-subscriptions');
const jwt = require('jsonwebtoken');
const Book = require('./models/book');
const Author = require('./models/author');
const User = require('./models/user');
require('dotenv').config();

const pubsub = new PubSub();

const { JWT_SECRET } = process.env;

// apollo server waits for the promise to resolve, and returns the result.
const resolvers = {
  Query: {
    authorCount: async () => await Author.collection.countDocuments(),
    bookCount: async () => await Book.collection.countDocuments(),
    allAuthors: async () => await Author.find({}).populate('books'),
    allBooks: async (root, args) => {
      let res = await Book.find({}).populate('author');
      if (args.author) res = res.filter((b) => b.author.name === args.author);
      if (args.genre) res = res.filter((b) => b.genres.includes(args.genre));
      return res;
    },

    allGenres: async (root, args) => {
      const res = (await Book.find({})).map((b) => b.genres);
      return res.flat().filter((val, idx, self) => self.indexOf(val) === idx);
    },

    me: (root, args, context) => context.currentUser,
  },

  Mutation: {
    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) throw new AuthenticationError("not authenticated");
      const author = await Author.findOne({ name: args.name }).populate('books');
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
      let author = await Author.findOne({ name: authorName });
      if (!author) author = await new Author({ name: authorName }).save();
      try {
        const book = await new Book({ ...otherArgs, author }).save();
        author.books = author.books.concat(book);
        await author.save();
        pubsub.publish('BOOK_ADDED', { bookAdded: book });
        return book;
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
        });
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') throw new UserInputError("wrong credentials");

      const userForToken = { username: user.username, id: user._id };
      return { value: jwt.sign(userForToken, JWT_SECRET) };
    },
  },

  /*
  Author: {
    bookCount: async (root) => {
      // n+1 problem
      // we can see that we are performing too many queries when performing the query allAuthors
      // console.log('bookCount query!');
      const author = await Author.find({ name: root.name });
      return (await Book.find({ author })).length;
    },
  },
  */

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED']),
    },
  },
};

module.exports = resolvers;
