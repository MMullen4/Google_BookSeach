// import { gql } from 'apollo-server-express';

const typeDefs = `
type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
}

type Book {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
}

type Auth {
    token: ID!
    user: User
}

input BookInput {
    bookId: String!
    authors: [String]
    description: String!
    title: String!
    image: String
    link: String
}.

type Query {
    me: User
}

type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookData: BookInput!): User
    removeBook(bookId: String!): User
}`;

// define TS interfaces to match GQL types
interface Book {
  bookId: string;
  authors: string[];
  description: string;
  title: string;
  image?: string;
  link?: string;
}
interface User {
  _id: string;
  username: string;
  email: string;
  bookCount: number;
  savedBooks: Book[];
}
interface Auth {
  token: string;
  user: User;
}
interface BookInput {
  bookId: string;
  authors: string[];
  description: string;
  title: string;
  image?: string;
  link?: string;
}

export { typeDefs, Book, User, Auth, BookInput };
