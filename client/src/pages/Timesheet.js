import React, { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_TIMESHEET } from '../utils/queries';
import { ADD_LINEITEM, DELETE_LINEITEM, EDIT_LINEITEM } from '../utils/mutations';
import Auth from '../utils/auth';

export default function Timesheet() {

    const { timesheetId } = useParams();

    console.log("TIMESHEET ID: ", timesheetId);

    const { loading, data } = useQuery(
        QUERY_TIMESHEET, { variables: { timesheetId: timesheetId } }
    );

    const timesheet = data?.timesheet || {};
    console.log(timesheet);

    // adding our queried timesheets to an array of timesheets objects
    const lineItemsArr = timesheet.lineItems || [];
    console.log("LINEITEMS ARR: ", lineItemsArr);

    // calculations for total minutes and cost
    let sumMins = 0;
    let sumCost = 0;
    for (let i = 0; i < lineItemsArr.length; i++) {
        sumMins += lineItemsArr[i].minutes;
        sumCost += lineItemsArr[i].minutes * lineItemsArr[i].rate;
    }
    console.log("TOTAL MINS: ", sumMins);
    console.log("TOTAL COST: ", sumCost);

    const [formState, setFormState] = useState({
        timesheetId: timesheetId,
    });

    const [addLineItem] = useMutation(ADD_LINEITEM);

    const [deleteLineItem] = useMutation(DELETE_LINEITEM);

    const [editLineItem] = useMutation(EDIT_LINEITEM);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormState({ ...formState, [name]: value }, console.log('FORMSTATE ', formState));
        ;
    };

    const handleAddLineItem = async (event) => {
        event.preventDefault();

        console.log("FORMSTATE: ", formState);

        try {
            await addLineItem({
                variables: {
                    timesheetId: formState.timesheetId,
                    rate: parseInt(formState.rate),
                    date: formState.date,
                    minutes: parseInt(formState.minutes)
                }
            });

            window.location.assign('/timesheet/' + timesheetId)
        } catch (e) {
            console.log("Please populate all fields!");
            if (!document.querySelector("#addLineItem > div > div > form > div.modal-body > p")) {
                const failText = `<p style="color:red">Please populate all fields correctly</p>`;
                document.querySelector("#addLineItem > div > div > form > .modal-body").append(document.createElement("p"));
                document.querySelector("#addLineItem > div > div > form > div.modal-body > p").innerHTML = failText;
            }
        }
    };

    let clickedEditId = "";
    const clickedEdit = async (e) => {
        setFormState({ timesheetId: timesheetId, lineItemsId: e.target.name });
        console.log("FORMSTATE: ", formState);
    }

    const handleEdit = async (event) => {

        try {
            console.log(formState)
            await editLineItem({
                variables: {
                    lineItemsId: formState.lineItemsId,
                    rate: parseInt(formState.rate),
                    date: formState.date,
                    minutes: parseInt(formState.minutes)
                }
            });


            window.location.assign('/timesheet/' + timesheetId);
        } catch (e) {
            console.error(e);
        }
    };

    const handleDelete = async (event) => {

        const { name } = event.target;

        console.log(event.target.name);

        try {
            console.log(name, timesheetId)
            await deleteLineItem({
                variables: { timesheetId: timesheetId, lineItemsId: name }
            });


            window.location.assign('/timesheet/' + timesheetId);
        } catch (e) {
            console.error(e);
        }
    };

    // we check to see if the current user is the owner of the timesheet
    if (!Auth.loggedIn() || timesheet !== {}) {
        console.log("user and timeline exist")
        let curUser = Auth.getUser().data.username;
        let curOwner = timesheet.owner;
        if (curUser !== curOwner && curOwner !== undefined) {
            return <Navigate to={"/"} />;
        }
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
            <h1>Welcome, {timesheet.owner}</h1>
            <h2 class="text-danger">{timesheet.description}</h2>

            {/* Add Line Item modal */}
            <div>
                <button type="button" className="btn btn-light mt-5 text" data-bs-toggle="modal" data-bs-target="#addLineItem">
                    Add Line Item
                </button>
                <div className="modal fade text-dark" id="addLineItem" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Add Line Item: </h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <form>
                                <div className="modal-body">
                                    <label htmlFor="date" className="form-label">Date</label>
                                    <input type="text" className="form-control" id='date' name='date' placeholder='1/1/2000' onChange={handleChange} />
                                    <label htmlFor="rate" className="form-label">Rate ($/min)</label>
                                    <input type="text" className="form-control" id='rate' name='rate' placeholder='15' onChange={handleChange} />
                                    <label htmlFor="minutes" className="form-label">Minutes</label>
                                    <input type="text" className="form-control" id='minutes' name='minutes' placeholder='60' onChange={handleChange} />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button className='btn btn-danger' onClick={handleAddLineItem}>Add Line Item</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="modal fade text-dark" id="editLineItem" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Line Item: </h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <form>
                                <div className="modal-body">
                                    <label htmlFor="date" className="form-label">Date</label>
                                    <input type="text" className="form-control" id='date' name='date' placeholder='1/1/2000' onChange={handleChange} />
                                    <label htmlFor="rate" className="form-label">Rate ($/min)</label>
                                    <input type="text" className="form-control" id='rate' name='rate' placeholder='15' onChange={handleChange} />
                                    <label htmlFor="minutes" className="form-label">Minutes</label>
                                    <input type="text" className="form-control" id='minutes' name='minutes' placeholder='60' onChange={handleChange} />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button className='btn btn-danger' onClick={handleEdit}>Edit Line Item</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div class="my-5" style={{ display: "flex", flex: "0 1 auto" }}>
                {lineItemsArr.length > 0 ? <>
                    <table class="table table table-dark table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Date</th>
                                <th scope="col">Rate</th>
                                <th scope="col">Minutes</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {lineItemsArr.map((lineItem) => (
                                <tr key={lineItem._id}>
                                    <th scope="row">{lineItem.date}</th>
                                    <th>{lineItem.rate}</th>
                                    <th>{lineItem.minutes}</th>
                                    <th>
                                        <button type="button" name={lineItem._id} className="btn btn-light text" data-bs-toggle="modal" data-bs-target="#editLineItem" style={{ marginLeft: "5px" }} onClick={clickedEdit}>
                                            EDIT
                                        </button>
                                        <button type="button" name={lineItem._id} className="btn btn-danger text" style={{ marginLeft: "5px" }} onClick={handleDelete}>
                                            DELETE
                                        </button>
                                    </th>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </> : <></>}
            </div>
            {lineItemsArr.length > 0 ? <><p>Total Time: {sumMins} Minutes</p>
                <p>Total Cost: ${sumCost}</p> </> : <><h3>No Logged Line Items</h3></>}

        </div>
    )
}