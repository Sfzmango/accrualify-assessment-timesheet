import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_TIMESHEET } from '../utils/queries';
import { ADD_LINEITEM, DELETE_LINEITEM } from '../utils/mutations';
import Auth from '../utils/auth';

export default function Timesheet() {

    const { timesheetId } = useParams();

    console.log(timesheetId);

    const { loading, data } = useQuery(
        QUERY_TIMESHEET, { variables: { timesheetId: timesheetId } }
    );

    const timesheet = data?.timesheet || {};
    console.log(timesheet);

    // adding our queried timesheets to an array of timesheets objects
    const lineItemsArr = timesheet.lineItems || [];
    console.log("LINEITEMS ARR: ", lineItemsArr);

    const [formState, setFormState] = useState({
        rate: 0,
        date: "1/1/2000",
        minutes: 0
    });

    const [addLineItem] = useMutation(ADD_LINEITEM);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormState({ ...formState, [name]: value });
    };

    const handleAddLineItem = async (event) => {
        event.preventDefault();

        //we use object destructuring to grab all the data from the formState
        let { rate, date, minutes } = formState;

        //now we try to add the moment to the database and reload the page if it works
        //otherwise we send the error to the console
        try {
            await addLineItem({
                variables: {
                    timesheetId: timesheetId._id,
                    rate: rate,
                    date: date,
                    minutes: minutes
                }
            });

            window.location.assign('/timesheet/' + timesheetId)
        } catch (e) {
            console.error(e);
        }
    };

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
            <div style={{ display: "flex", flex: "0 1 auto" }}>
                <table class="table table table-dark table-striped">

                    {lineItemsArr ? <>
                        <thead>
                            <tr>
                                <th scope="col">Date</th>
                                <th scope="col">Rate</th>
                                <th scope="col">Minutes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lineItemsArr.map((lineItem) => (
                                <tr>
                                    <th scope="row">{lineItem.date}</th>
                                    <th>{lineItem.rate}</th>
                                    <th>{lineItem.minutes}</th>
                                </tr>

                            ))}
                        </tbody>
                    </> : <></>}
                </table>
            </div>
        </div>
    )
}