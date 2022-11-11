import React, { useState } from 'react';
import { Navigate, useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER, QUERY_TIMESHEETS } from '../utils/queries';
import { ADD_TIMESHEET, DELETE_TIMESHEET } from '../utils/mutations';
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

    // the code chunk below is used for adding a new timesheet to the database
    // adding a state variable for creating a new timesheet
    const [formState, setFormState] = useState({
        description: ''
    });

    const [addTimesheet] = useMutation(ADD_TIMESHEET);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormState({ ...formState, [name]: value });
    };

    const handleAddTimesheet = async (event) => {
        event.preventDefault();

        const { description } = formState;

        console.log("formstate: ", formState)
        console.log("owner: ", user.username)
        try {
            await addTimesheet({
                variables: {
                    owner: user.username,
                    description: description
                }
            });
            window.location.assign('/dashboard/:' + user._id);
        } catch (e) {
            console.error(e);
        }
    }

    // redirect to login page if user is not logged in or in another user's dashboard
    if (!Auth.loggedIn() || Auth.getUser().data._id !== id) {
        return <Navigate to={"/"} />;
    }

    if (loading) {
        return (
            <div style={{ height: '100vh', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#000000', color: '#FFFFFF', fontFamily: 'Jura, sans-serif' }}>
                <div className="spinner-border text-danger sm:col-2" style={{ width: "200px", height: "200px" }} role="status">
                </div>
                <div style={{ fontSize: "4rem" }}>
                    <span>Loading...</span>
                </div>
            </div>
        );
    };

    return (
        <div style={{ height: '100vh', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#000000', color: '#FFFFFF', fontFamily: 'Jura, sans-serif' }}>
            <h1 className="mb-5">Welcome, {user.username}</h1>
            <div>
                <div className="list-group">
                    {timesheetsArr && timesheetsArr.map((timesheet) => (
                        <Link key={timesheet._id} to={"/"} className="list-group-item list-group-item-action active bg-danger border-dark">
                            <div className="d-flex w-100 justify-content-between">
                                <h5 className="mb-1 text-white" >{timesheet.description}</h5>
                            </div>
                        </Link>
                    ))
                    }
                </div>
            </div>

            {/* create timesheet modal */}
            <div>
                <button type="button" className="btn btn-light mt-5 text" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    Create Timesheet
                </button>
                <div className="modal fade text-dark" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Create Timesheet: </h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <form>
                                <div className="modal-body">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <input type="text" className="form-control" id='description' name='description' placeholder='Description' onChange={handleChange} />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button className='btn btn-danger' onClick={handleAddTimesheet}>Create Timesheet</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};