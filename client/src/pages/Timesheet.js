import React from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { QUERY_TIMESHEET } from '../utils/queries';
import { DELETE_LINEITEM } from '../utils/mutations';
import { useBreakpoints } from 'react-breakpoints-hook';
import Auth from '../utils/auth';

export default function Timesheet() {
    return <h1>THIS IS THE TIMESHEET</h1>
}