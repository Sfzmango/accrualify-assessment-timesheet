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
        owner: String
        description: String
        rate: Int
        lineItems: [LineItem]!
    }

    type LineItem {
        _id: ID
        date: String
        minutes: Int
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        user(userId: ID!): User
        signupUser(username: String!): User
        timesheet(timesheetId: ID!): Timesheet
        users: [User]
        timesheets: [Timesheet]
        userTimesheets(owner: String!): [Timesheet]
    }

    type Mutation {
        addUser(username: String!, password: String!): Auth
        addTimesheet(owner: String!, description: String!, rate: Int!): Timesheet
        editTimesheet(timesheetId: ID!, owner: String!, description: String!, rate: Int!): Timesheet
        deleteTimesheet(timesheetId: ID!): Timesheet
        addLineItem(timesheetId: ID!, date: String!, minutes: Int!): Timesheet
        editLineItem(lineItemsId: ID!, date: String!, minutes: Int!): Timesheet
        deleteLineItem(timesheetId: ID!, lineItemsId: ID!): Timesheet
        login(username: String!, password: String!): Auth
    }
`;

module.exports = typeDefs;