import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        _id
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $password: String!) {
    addUser(username: $username, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_TIMESHEET = gql`
  mutation addTimesheet($description: String!, $owner: String!) {
    addTimesheet(description: $description, owner: $owner) {
      _id
      description
      owner
      lineItems {
        _id
        date
        rate
        minutes
      }
    }
  }
`;

export const DELETE_TIMESHEET = gql`
  mutation deleteTimesheet($timesheetId: ID!) {
    deleteTimesheet(timesheetId: $timesheetId) {
      _id
      description
    }
  }
`;

export const ADD_LINEITEM = gql`
  mutation addLineItem($timesheetId: ID!, $rate: Int!, $date: String!, $minutes: Int!) {
    addLineItem(timesheetId: $timesheetId, rate: $rate, date: $date, minutes: $minutes) {
      _id
      lineItems {
        _id
        rate
        date
        minutes
      }
    }
  }
`;

export const EDIT_LINEITEM = gql`
  mutation editLineItem($lineItemsId: ID!, $rate: Int!, $date: String!, $minutes: Int!) {
    editLineItem(lineItemsId: $lineItemsId, rate: $rate, date: $date, minutes: $minutes) {
      _id
      lineItems {
        _id
        rate
        date
        minutes
      }
    }
  }
`;

export const DELETE_LINEITEM = gql`
  mutation deleteLineItem($timesheetId: ID!, $lineItemsId: ID!) {
    deleteLineItem(timesheetId: $timesheetId, lineItemsId: $lineItemsId) {
      _id
    }
  }
`;