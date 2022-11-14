import { gql } from '@apollo/client';

export const QUERY_TIMESHEET = gql`
    query getTimesheet($timesheetId: ID!) {
        timesheet(timesheetId: $timesheetId) {
          _id
          description
          owner
          rate
          lineItems {
            _id
            date
            minutes
          }
        }
      }
`;

export const QUERY_TIMESHEETS = gql`
      query getTimesheets($owner: String!) {
        userTimesheets(owner: $owner) {
          _id
          description
          owner
          rate
        }
      }
`;

export const QUERY_USER = gql`
    query getUser($userId: ID!) {
        user(userId: $userId) {
            _id
            username
            password
        }
    }
`;

export const QUERY_USERNAME = gql`
    query getUser($username: String!) {
        signupUser(username: $username) {
            _id
            username
            password
        }
    }
`;