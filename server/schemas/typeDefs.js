const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID
        username: String
        email: String
        password: String
        savedBooks: [Book]
    }

    type Book {
        bookId: String
        authors: [String]
        description: String
        image: String
        link: String
        title: String
    }

    type Auth {
        token: ID
        profile: User
    }

    type Query {
        getSingleUser(_id: ID!, username: String!): [User]
    }

    type Mutation {
        createUser(username: String!, password: String!, email: String!): Auth
        login(email: String!, password: String!) : Auth
        saveBook(_id: ID!): Book
        deleteBook(_id: ID!): Book
    }
`

module.exports = typeDefs