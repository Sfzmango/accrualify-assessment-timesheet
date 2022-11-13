import React, { useState } from 'react';
import { Navigate, useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER, QUERY_TIMESHEETS } from '../utils/queries';
import { ADD_TIMESHEET, EDIT_TIMESHEET, DELETE_TIMESHEET } from '../utils/mutations';
import Auth from '../utils/auth';

export default function Dashboard() {

    // use the userId that is in the route parameter
    const { userId } = useParams();

    // declare a new variable w/o the colon from the userId parameter
    let id = userId.substring(1);

    console.log("AUTHGETUSER: ", Auth.getUser().data._id);

    // we are querying the userId in order to find the user and timesheets associated with it
    const { loading, data } = useQuery(
        QUERY_USER, { variables: { userId: id } }
    );
    const user = data?.user || {};
    const qTimesheets = useQuery(
        QUERY_TIMESHEETS, { variables: { owner: user.username } }
    );

    // adding our queried timesheets to an array of timesheets objects
    const timesheetsArr = qTimesheets.data?.userTimesheets || [];

    // the code chunk below is used for adding a new timesheet to the database
    // adding a state variable for creating a new timesheet
    const [formState, setFormState] = useState({});

    // add mutation functions to use
    const [addTimesheet] = useMutation(ADD_TIMESHEET);
    const [editTimesheet] = useMutation(EDIT_TIMESHEET);
    const [deleteTimesheet] = useMutation(DELETE_TIMESHEET);

    // update the formstate whenever there is a change in the input
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormState({ ...formState, [name]: value });
    };

    // handler for adding new timesheets
    const handleAddTimesheet = async (event) => {
        event.preventDefault();

        console.log(formState)
        try {
            await addTimesheet({
                variables: {
                    owner: user.username,
                    description: formState.description,
                    rate: parseInt(formState.rate)
                }
            });

            window.location.assign('/dashboard/:' + user._id);

        } catch (e) {
            if (!document.querySelector('#createTSModal > div > div > form > div.modal-body > p')) {
                const failText = `<p style='color:red'>Please populate all fields correctly</p>`;
                document.querySelector('#createTSModal > div > div > form > div.modal-body').append(document.createElement('p'));
                document.querySelector('#createTSModal > div > div > form > div.modal-body > p').innerHTML = failText;
            };
        };
    };

    // handler for editting a timesheet data
    const handleEdit = async (event) => {
        event.preventDefault();

        try {
            await editTimesheet({
                variables: {
                    timesheetId: formState.timesheetId,
                    owner: user.username,
                    description: formState.description,
                    rate: parseInt(formState.rate)
                }
            });

            window.location.assign('/dashboard/:' + id);

        } catch (e) {
            if (!document.querySelector('#editTSModal > div > div > form > div.modal-body > p')) {
                const failText = `<p style='color:red'>Please populate all fields correctly</p>`;
                document.querySelector('#editTSModal > div > div > form > div.modal-body').append(document.createElement('p'));
                document.querySelector('#editTSModal > div > div > form > div.modal-body > p').innerHTML = failText;
            };
        };
    };

    // handler for deleting a timesheet
    const handleDelete = async (event) => {
        event.preventDefault();

        const { name } = event.target;

        try {
            await deleteTimesheet({ variables: { timesheetId: name } });

            window.location.assign('/dashboard/:' + id);

        } catch (e) {
            console.error(e);
        };
    };

    // we save the timesheet id on the clicked edit btn to our formstate
    const clickedEdit = async (e) => { setFormState({ ...formState, timesheetId: e.target.name, owner: user.username }); }

    // redirect to login page if user is not logged in or in another user's dashboard
    if (!Auth.loggedIn() || Auth.getUser().data._id !== id) { return (<Navigate to={'/'} />); };

    // loading screen
    if (loading) {
        return (
            <div style={{ height: '100vh', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#000000', color: '#FFFFFF', fontFamily: 'Jura, sans-serif' }}>
                <div className='spinner-border text-danger sm:col-2' style={{ width: '200px', height: '200px' }} role='status'>
                </div>
                <div style={{ fontSize: '4rem' }}>
                    <span>Loading...</span>
                </div>
            </div>
        );
    };

    return (
        <div style={{ height: '100vh', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#000000', color: '#FFFFFF', fontFamily: 'Jura, sans-serif' }}>
            <h1 className='mb-5'>Welcome, {user.username}</h1>

            {/* list of timesheets */}
            <div>
                <div className='list-group'>
                    {timesheetsArr && timesheetsArr.map((timesheet) => (
                        <div key={timesheet._id} className='list-group-item list-group-item-action active bg-danger border-dark'>
                            <div className='d-flex w-100 justify-content-between align-items-center'>
                                <Link onClick={() => { window.location.assign('/timesheet/' + timesheet._id) }} style={{ display: 'flex', flex: '2 1 auto', textDecoration: 'none' }}>
                                    <h5 className='mb-1 text-white' >{timesheet.description}</h5>
                                </Link>
                                <button type='button' name={timesheet._id} className='btn btn-danger text' style={{ marginLeft: '20px' }} onClick={clickedEdit} data-bs-toggle='modal' data-bs-target='#editTSModal'>
                                    EDIT
                                </button>
                                <button type='button' name={timesheet._id} className='btn btn-danger text' style={{ marginLeft: '20px' }} onClick={handleDelete}>
                                    DELETE
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* create timesheet modal */}
            <div>
                <button type='button' className='btn btn-light mt-5 text' data-bs-toggle='modal' data-bs-target='#createTSModal'>
                    Create Timesheet
                </button>
                <div className='modal fade text-dark' id='createTSModal' tabIndex='-1'>
                    <div className='modal-dialog modal-dialog-centered'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h1 className='modal-title fs-5' id='createTSModalLabel'>Create Timesheet: </h1>
                                <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                            </div>
                            <form>
                                <div className='modal-body'>
                                    <label htmlFor='description' className='form-label'>Description</label>
                                    <input type='text' className='form-control' id='description' name='description' placeholder='Description' onChange={handleChange} />
                                    <label htmlFor='rate' className='form-label'>Rate ($/Min)</label>
                                    <input type='text' className='form-control' id='rate' name='rate' placeholder='10' onChange={handleChange} />
                                </div>
                                <div className='modal-footer'>
                                    <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>Close</button>
                                    <button className='btn btn-danger' onClick={handleAddTimesheet}>Create Timesheet</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* delete timesheet modal */}
                <div className='modal fade text-dark' id='editTSModal' tabIndex='-1'>
                    <div className='modal-dialog modal-dialog-centered'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h1 className='modal-title fs-5' id='editTSModalLabel'>Edit Timesheet: </h1>
                                <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                            </div>
                            <form>
                                <div className='modal-body'>
                                    <label htmlFor='description' className='form-label'>Description</label>
                                    <input type='text' className='form-control' id='description' name='description' placeholder='Description' onChange={handleChange} />
                                    <label htmlFor='rate' className='form-label'>Rate ($/Min)</label>
                                    <input type='text' className='form-control' id='rate' name='rate' placeholder='10' onChange={handleChange} />
                                </div>
                                <div className='modal-footer'>
                                    <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>Close</button>
                                    <button className='btn btn-danger' onClick={handleEdit}>Edit Timesheet</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};