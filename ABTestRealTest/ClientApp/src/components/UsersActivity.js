import React, { Component } from 'react';

export class UserActivity extends Component {
    static displayName = 'System users activity';

    constructor(props) {
        super(props);
        this.state = { systemUsers: [], loading: true };
        this.submitEditedDates = this.submitEditedDates.bind(this);
    }

    componentDidMount() {
        this.populateWeatherData();
    }

    submitEditedDates() {
        alert('submitEditedDates');
        for (var item of this.state.systemUsers) {
            item.registrationdate = '2021-01-18';
            item.lastactivitydate = '2021-01-18';
        }

        fetch('systemusers/updateusersdates', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.systemUsers)
        })
            .catch(err => console.log(err));
    }
    
    renderUserActivityTable = (systemUsers) => {
        return (
            <div>
                <table className='table table-striped' aria-labelledby="tabelLabel">
                    <thead>
                        <tr>
                            <th>UserId</th>
                            <th>Date Registration</th>
                            <th>Date Last Activity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {systemUsers.map(systemUser =>
                            <tr key={systemUser.id}>
                                <td>{systemUser.id}</td>
                                <td>{systemUser.registrationdate}</td>
                                <td>{systemUser.lastactivitydate}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <button className="btn btn-primary" onClick={this.submitEditedDates}>Save</button>
            </div>

        );
    }


    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderUserActivityTable(this.state.systemUsers);

        return (
            <div>
                <h1 id="tabelLabel" >System users activity</h1>
                <hr/>
                {contents}
            </div>
        );
    }

    async populateWeatherData() {
        const response = await fetch('systemusers/getsystemusers');
        const data = await response.json();
        this.setState({ systemUsers: data, loading: false });
    }

    
}