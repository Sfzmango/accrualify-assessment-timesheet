import React, { useState } from 'react';
import decode from 'jwt-decode';
import { useMutation } from '@apollo/client';
import { LOGIN, ADD_USER } from '../utils/mutations';
import Auth from '../utils/auth';

export default function Login() {

    // create a state variable to store user input in the form
    const [formState, setFormState] = useState({ username: '', password: '' });

    const [login, { error }] = useMutation(LOGIN);
    const [signup, { err, data }] = useMutation(ADD_USER);

    // create a handler for when the login button is clicked
    const handleLogin = async (event) => {
        event.preventDefault();

        // uses the data in our formstate to check if the user can be authenticated
        try {

            const { data } = await login({
                variables: { username: formState.username, password: formState.password }
            });

            const token = data.login.token;
            const decodeToken = decode(token);
            const userId = decodeToken.data._id;
            Auth.login(token, userId);
        }

        catch (e) {

        };
    };

    // update the formstate whenever there is a change in the input
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormState({ ...formState, [name]: value });
    };

    return (
        <>
        </>
    );
}