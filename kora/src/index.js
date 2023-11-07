import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import './index.css';
import App from './App';
import Login from './Login'; // this is the login page component
import Dashboard from './Dashboard'; // this is the dashboard page component that requires authentication
import "./tailwind.css";


const root = ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={App} /> // this will render the home page component when the path is "/"
        <Route path="/login" component={Login} /> // this will render the login page component when the path is "/login"
        <Route path="/dashboard" component={Dashboard} /> // this will render the dashboard page component when the path is "/dashboard"
        <Redirect to="/login" /> // this will redirect the user to the login page when they try to access any other path
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);