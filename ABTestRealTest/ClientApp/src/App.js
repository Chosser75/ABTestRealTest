import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { UserActivity } from './components/UsersActivity';
import './custom.css';

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
            <Route exact path='/' component={Home} />
            <Route path='/users-activity' component={UserActivity} />
      </Layout>
    );
  }
}
