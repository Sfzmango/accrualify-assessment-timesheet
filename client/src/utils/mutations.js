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
  mutation addTimesheet($owner: String!, $description: String!, $rate: Int!) {
    addTimesheet(owner: $owner, description: $description, rate: $rate) {
      _id
      owner
      description
      rate
      lineItems {
        _id
        date
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
  mutation addLineItem($timesheetId: ID!, $date: String!, $minutes: Int!) {
    addLineItem(timesheetId: $timesheetId, date: $date, minutes: $minutes) {
      _id
      lineItems {
        _id
        date
        minutes
      }
    }
  }
`;

export const EDIT_LINEITEM = gql`
  mutation editLineItem($lineItemsId: ID!, $date: String!, $minutes: Int!) {
    editLineItem(lineItemsId: $lineItemsId, date: $date, minutes: $minutes) {
      _id
      lineItems {
        _id
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