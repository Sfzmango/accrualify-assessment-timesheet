import React from 'react';
import { Navigate, useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER, QUERY_TIMESHEETS } from '../utils/queries';
import { DELETE_TIMESHEET } from '../utils/mutations';
import Auth from '../utils/auth';

export default function Dashboard() {

    // use the userId that is in the route parameter
    const { userId } = useParams();

    // declare a new variable w/o the colon from the userId parameter
    let id = userId.substring(1);

    // we are querying the userId in order to find the user and timesheets associated with it
    const { loading, data } = useQuery(
        QUERY_USER, { variables: { userId: id } }
    );
    const user = data?.user || {};
    console.log("USER: ", user);
    const qTimesheets = useQuery(
        QUERY_TIMESHEETS, { variables: { owner: user.username } }
    );

    // adding our queried timesheets to an array of timesheets objects
    const timesheetsArr = qTimesheets.data?.userTimesheets || [];
    console.log("TIMESHEETS ARR: ", timesheetsArr);

    // redirect to login page if user is not logged in
    if (!Auth.loggedIn()) {
        return <Navigate to={"/"} />;
    }

    if (loading) {
        return (
            <div style={{ height: '100vh', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#000000', color: '#FFFFFF', fontFamily: 'Jura, sans-serif' }}>
                <div class="spinner-border text-danger sm:col-2" style={{ width: "200px", height: "200px" }} role="status">
                </div>
                <div style={{ fontSize: "4rem" }}>
                    <span>Loading...</span>
                </div>
            </div>
        );
    };

    return (
        <div style={{ height: '100vh', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#000000', color: '#FFFFFF', fontFamily: 'Jura, sans-serif' }}>
            <h1 class="mb-5">Welcome, {user.username}</h1>

        </div >
    );
};