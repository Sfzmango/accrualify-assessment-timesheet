import React from 'react';
import { Navigate, useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER, QUERY_TIMESHEETS } from '../utils/queries';
import { DELETE_TIMESHEET } from '../utils/mutations';
import Auth from '../utils/auth';

export default function Dashboard() {
    return <h1>THIS IS THE DASHBOARD</h1>
}