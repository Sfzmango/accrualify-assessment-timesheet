import { gql } from '@apollo/client';

export const QUERY_TIMESHEET = gql`
    query getTimesheet($timesheetId: ID!) {
        timesheet(timesheetId: $timesheetId) {
          _id
          description
          user
          lineItemss {
            _id
            rate
            date
            minutes
          }
        }
      }
`;

export const QUERY_TIMESHEETS = gql`
      query getTimesheets($user: String!) {
        userTimesheets(user: $user) {
          _id
          description
          user
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