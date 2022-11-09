// declaring graph ql dependency
const { gql } = require('apollo-server-express');

// creating definitions for graphl ql 
const typeDefs = gql`
    type User {
        _id: ID
        username: String
        password: String
    }

    type Timesheet {
        _id: ID
        user: String
        description: String
        lineItems: [LineItem]!
    }

    type LineItem {
        _id: ID
        rate: Int
        date: String
        minutes: Int
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        user(userId: ID!): User
        timesheet(timesheetId: ID!): Timesheet
        users: [User]
        timesheets: [Timesheet]
        userTimesheets(author: String!): [Timesheet]
    }

    type Mutation {
        addUser(username: String!, password: String!): Auth
        addTimesheet(user: String!, description: String!): Timesheet
        deleteTimesheet(timesheetId: ID!): Timesheet
        addLineItem(timesheetId: ID!, rate: Int!, date: String!, minutes: Int!): Timesheet
        editLineItem(lineItemsId: ID!, rate: Int!, date: String!, minutes: Int!): Timesheet
        deleteLineItem(timesheetId: ID!, lineItemsId: ID!): Timesheet
        login(username: String!, password: String!): Auth
    }
`;

module.exports = typeDefs;