import React, { Component } from 'react';

import { RollingRetention } from './RollingRetention';

export class UserActivity extends Component {
    static displayName = 'System users activity';

    constructor(props) {
        super(props);
        this.state = {
            systemUsers: [],
            showRollingRetention: false,
            loading: true
        };
        this.submitEditedDates = this.submitEditedDates.bind(this);
        this.checkDate = this.checkDate.bind(this);
    }

    componentDidMount() {
        this.populateSystemUsers();
    }

    async submitEditedDates() { 
        //var editedUsers = Object.assign([], this.state.systemUsers); // doesn't work

        for (var user of this.state.systemUsers) {
            user.registrationDate = this.formatDate(user.registrationDate);
            user.lastActivityDate = this.formatDate(user.lastActivityDate);
        }

        const response = await fetch('systemusers/updateusersdates', {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json'
                },
            body: JSON.stringify(this.state.systemUsers)
            })
            .catch(err => console.log(err));
        
        this.convertToLocaleDates(this.state.systemUsers);

        this.setState({ systemUsers: this.state.systemUsers, showRollingRetention: false });

        if (response.ok) {
            alert("Data is successfully saved to DB");
        }
    }
        
    editDate = (field, id, newDate) => {
        if (!/^[0-9.]+$/.test(newDate)) {
            this.setState({
                systemUsers: this.state.systemUsers
            });
            return;
        }

        this.setDate(field, id, newDate);        
    }

    setDate(field, id, newDate) {
        for (var user of this.state.systemUsers) {
            if (user.id === id) {
                if (field === "registrationDate") {
                    user.registrationDate = newDate;
                }
                else {
                    user.lastActivityDate = newDate;
                }

                this.setState({
                    systemUsers: this.state.systemUsers
                });

                return;
            }
        }
    }

    async checkDate(field, id, newDate) {
        var isValid = this.validateDate(newDate)
        if (isValid === false) {
            var user = await this.GetUser(id);
            if (field === "registrationDate") {
                this.setDate(field, id, new Date(user.registrationDate).toLocaleDateString());
            }
            else {
                this.setDate(field, id, new Date(user.lastActivityDate).toLocaleDateString());
            }
        }
    }

    validateDate(newDate) {
        if (/^[0-9]{2}.[0-9]{2}.[0-9]{4}$/.test(newDate)) {
            return true;
        }
        return false;
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
                                <td><input className="border-0" value={systemUser.registrationDate}
                                    onChange={(event) => this.editDate("registrationDate", systemUser.id, event.target.value)}
                                    onBlur={(event) => this.checkDate("registrationDate", systemUser.id, event.target.value)} /></td>
                                <td><input className="border-0" value={systemUser.lastActivityDate}
                                    onChange={(event) => this.editDate("lastActivityDate", systemUser.id, event.target.value)} /></td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <button className="btn btn-primary" style={{ width: 100 }} onClick={this.submitEditedDates}>Save</button>
                <br/>
                <button className="btn btn-primary mt-4" style={{ width: 100 }} onClick={this.showHideRollingRetention}>
                    {!this.state.showRollingRetention && "Calculate" || "Hide"}
                </button>
                <br /><br />
                {this.state.showRollingRetention && <RollingRetention />}
            </div>

        );
    }

    showHideRollingRetention = () => {
        this.setState({ showRollingRetention: !this.state.showRollingRetention });
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

    async populateSystemUsers() {
        const response = await fetch('systemusers/getsystemusers');
        const data = await response.json();
        this.convertToLocaleDates(data);
        this.setState({ systemUsers: data, loading: false });
    }

    async GetUser(id) {
        const response = await fetch('systemusers/getsystemuser/' + id );
        return await response.json();
    }

    convertToLocaleDates(data) {
        for (let user of data) {
            if (user.registrationDate !== "0") {
                user.registrationDate = new Date(user.registrationDate).toLocaleDateString();
            }
            if (user.lastActivityDate !== "0") {
                user.lastActivityDate = new Date(user.lastActivityDate).toLocaleDateString();
            }
        }
    }
}