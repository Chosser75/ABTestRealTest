import React, { Component } from 'react';

export class UserActivity extends Component {
    static displayName = 'System users activity';

    constructor(props) {
        super(props);
        this.state = {
            systemUsers: [],
            loading: true
        };
        this.submitEditedDates = this.submitEditedDates.bind(this);
    }

    componentDidMount() {
        this.populateWeatherData();
    }

    submitEditedDates() {        
        fetch('systemusers/updateusersdates', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.systemUsers)
        })
            .catch(err => console.log(err));
    }
        
    editDate = (field, id, newDate) => {
        let date = this.formatDate(newDate);

        for (var user of this.state.systemUsers) {
            if (user.id == id) {
                if (field == "registrationDate") {
                    user.registrationDate = date;
                }
                else {
                    user.lastActivityDate = date;
                }

                this.setState({
                    systemUsers: this.state.systemUsers
                });

                return;
            }
        }

        //if (field == "registrationDate") {
        //    this.state.systemUsers[id - 1].registrationDate = newDate;
        //}
        //else {
        //    this.state.systemUsers[id - 1].lastActivityDate = newDate;
        //}
    }

    formatDate(newDate) {
        let dateValues = newDate.split('.');
        let day = dateValues[0];
        let month = dateValues[1];        
        let year = dateValues[2];
        let date = year + "-" + month + "-" + day + "T00:00:00";
        return date;
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
                                <td><input className="border-0" value={new Date(systemUser.registrationDate).toLocaleDateString()}
                                    onChange={(event) => this.editDate("registrationDate", systemUser.id, event.target.value)} /></td>
                                <td><input className="border-0" value={new Date(systemUser.lastActivityDate).toLocaleDateString()}
                                    onChange={(event) => this.editDate("lastActivityDate", systemUser.id, event.target.value)} /></td>
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
        console.log(data);
        this.setState({ systemUsers: data, loading: false });
    }

    
}