import React, { useState, useEffect } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from './utils/auth';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Timesheet from './pages/Timesheet';

const httpLink = createHttpLink({
  uri: '/graphql'
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {

  // creating a state to check if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // checks if user is logged in using our state
  useEffect(() => {
    if (Auth.loggedIn()) {
      setIsLoggedIn(true);
    };
  });

  // function to log the user out
  const logout = () => {
    Auth.logout();
    setIsLoggedIn(false);
  };

  return (
    <ApolloProvider client={client}>
      <Router>
        {/* logout btn if user is logged in */}
        <div className='flex-column justify-flex-start min-100-vh bg-black'>
          {isLoggedIn ? <button type='button' className='btn btn-danger text' style={{ position: 'fixed', right: '20px', top: '20px' }} onClick={logout}>
            LOGOUT
          </button> : <></>}
          <Routes>
            <Route
              path='/'
              element={<Login />} />
            <Route
              path='/dashboard/:userId'
              element={<Dashboard />} />
            <Route
              path='/timesheet/:timesheetId'
              element={<Timesheet />} />
          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
