import React, { useState } from 'react';
import decode from 'jwt-decode';
import { useMutation } from '@apollo/client';
import { LOGIN, ADD_USER } from '../utils/mutations';
import Auth from '../utils/auth';

export default function Login() {

    // create a state variable to store user input in the form
    const [formState, setFormState] = useState({ username: '', password: '' });

    const [login, { error }] = useMutation(LOGIN);
    const [addUser, { err, data }] = useMutation(ADD_USER);

    // create a handler for when the login button is clicked
    const handleLogin = async (event) => {
        event.preventDefault();

        // checks to see if the text boxes are populated and if not, display a warning. if it gets populated, then delete the warning
        if (!document.querySelector("#username").value) {
            const failText = `<p style="color:red">Please input a username</p>`;
            document.querySelector("#root > div > div > form > div:nth-child(1)").append(document.createElement("p"));
            document.querySelector("#root > div > div > form > div:nth-child(1) > p").innerHTML = failText;
        }
        else if (document.querySelector("#root > div > div > form > div:nth-child(1) > p") && document.querySelector("#username").value) {
            document.querySelector("#root > div > div > form > div:nth-child(1) > p").remove();
        }

        if (!document.querySelector("#password").value) {
            const failText = `<p style="color:red">Please input a password</p>`;
            document.querySelector("#root > div > div > form > div:nth-child(2)").append(document.createElement("p"));
            document.querySelector("#root > div > div > form > div:nth-child(2) > p").innerHTML = failText;
        }
        else if (document.querySelector("#root > div > div > form > div:nth-child(2) > p") && document.querySelector("#password").value) {
            document.querySelector("#root > div > div > form > div:nth-child(2) > p").remove();
        }

        // uses the data in our formstate to check if the user can be authenticated
        try {

            console.log('Submitted formState: ', formState);

            const { data } = await login({
                variables: { username: formState.username, password: formState.password }
            });

            const token = data.login.token;
            const decodeToken = decode(token);
            const userId = decodeToken.data._id;
            Auth.login(token, userId);
        }

        catch (e) {
            // on incorrect login, we append a line of text saying the user login failed
            console.log("Incorrect login credentials!")
            if (!document.querySelector("#root > div > div > form > p")) {
                const failText = `<p style="color:red">Incorrect Login Credentials</p>`;
                document.querySelector("#root > div > div > form").lastChild.before(document.createElement("p"));
                document.querySelector("#root > div > div > form > p").innerHTML = failText;
            }
        };
    };

    // create a handler for when the signup button is clicked
    const handleSignup = async (event) => {
        event.preventDefault();

        // checks to see if the text boxes are populated and if not, display a warning. if it gets populated, then delete the warning
        if (!document.querySelector("#username").value) {
            const failText = `<p style="color:red">Please input a username</p>`;
            document.querySelector("#root > div > div > form > div:nth-child(1)").append(document.createElement("p"));
            document.querySelector("#root > div > div > form > div:nth-child(1) > p").innerHTML = failText;
        }
        else if (document.querySelector("#root > div > div > form > div:nth-child(1) > p") && document.querySelector("#username").value) {
            document.querySelector("#root > div > div > form > div:nth-child(1) > p").remove();
        }

        if (!document.querySelector("#password").value) {
            const failText = `<p style="color:red">Please input a password</p>`;
            document.querySelector("#root > div > div > form > div:nth-child(2)").append(document.createElement("p"));
            document.querySelector("#root > div > div > form > div:nth-child(2) > p").innerHTML = failText;
        }
        else if (document.querySelector("#root > div > div > form > div:nth-child(2) > p") && document.querySelector("#password").value) {
            document.querySelector("#root > div > div > form > div:nth-child(2) > p").remove();
        }

        // uses the data in our formstate to check if the user can be authenticated
        try {

            console.log('Submitted formState: ', formState);

            const { data } = await addUser({
                variables: { username: formState.username, password: formState.password },
            });

            const token = data.addUser.token;
            const decodeToken = decode(token);
            const userId = decodeToken.data._id;
            Auth.login(token, userId);
        }

        catch (e) {
            // on incorrect login, we append a line of text saying the user login failed
            console.log("Signup Failed!")
            if (!document.querySelector("#root > div > div > form > p")) {
                const failText = `<p style="color:red">Signup Failed</p>`;
                document.querySelector("#root > div > div > form").lastChild.before(document.createElement("p"));
                document.querySelector("#root > div > div > form > p").innerHTML = failText;
            }
        };
    };

    // update the formstate whenever there is a change in the input
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormState({ ...formState, [name]: value });
    };

    return (
        <div style={{ height: '100vh', padding: '0', margin: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#000000', color: '#FFFFFF', fontFamily: 'Jura, sans-serif' }}>
            <h1 className='p-4'>Timesheet Manager</h1>
            <form style={{ width: '300px' }}>
                <div className='mb-3' style={{}}>
                    <label htmlFor='username' className='form-label'>Username</label>
                    <input type='text' name='username' className='form-control' id='username' placeholder='Username' onChange={handleChange} />
                </div>
                <div className='mb-3'>
                    <label htmlFor='password' className='form-label'>Password</label>
                    <input type='password' name='password' className='form-control' id='password' placeholder='Password' onChange={handleChange} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button className='btn btn-danger' onClick={handleSignup}>Create Account</button>
                    <button className='btn btn-danger' onClick={handleLogin}>Login</button>
                </div>
            </form>
        </div>
    );
}