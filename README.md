# full_stack_open_2021_part8

[Course](https://fullstackopen.com/en/part8)
 
## Part a) GraphQL-server

Basic exercises with GraphQL. Types, Mutations and Queries.

```
# how to run?
npm run dev
```

## Part b) React and GraphQL

We create some basic operations with the authors and books using useQuery and useMutation.<br>
To see the errors, go to Developer Console -> Network.<br>
In Name, there should be a localhost in red.

### Configuration

Configure eslint.
```bash
npm install --save-dev eslint
npm init @eslint/config
```

Add jsconfig to import everything from src.

### How to run?

We need to start the server of part a.

```
npm start
```

## Part c) Database and user administration

We have to configure the server to use [mongoose](https://github.com/dajimenezriv/full_stack_open_2021_part4).

Explains how to use MongoDB and GraphQL. Also with user authentication.

## Part d) Login and updating the cache

How to login using GraphQL and setting the token in the header.<br>
Update cache of Apollo Client.<br>

## Part f) Fragments and subscriptions

Instead of the client sending queries to the server to get the new information.<br>
The client will be listening to the server using subscriptions, and the server, whenever has a change sends the information to all its subscribers.<br>
