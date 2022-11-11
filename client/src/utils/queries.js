import { gql } from '@apollo/client';

export const QUERY_TIMESHEET = gql`
    query getTimesheet($timesheetId: ID!) {
        timesheet(timesheetId: $timesheetId) {
          _id
          description
          owner
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
      query getTimesheets($owner: String!) {
        userTimesheets(owner: $owner) {
          _id
          description
          owner
        }
      }
`;

export const QUERY_USER = gql`
    query getUser($userId: ID!) {
        user(_id: $userId) {
            _id
            username
            password
        }
    }
`;