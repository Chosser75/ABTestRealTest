import React, { Component } from 'react';
import '../custom.css'
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
        else {
            var date = this.splittedDate.day + "." + this.splittedDate.month + "." + this.splittedDate.year;
            date = this.formatDate(date);
            this.setDate(field, id, new Date(date).toLocaleDateString());            
        }
    }

    validateDate(newDate) {
        if (/^[0-9]{2}.[0-9]{2}.[0-9]{4}$/.test(newDate) || 
            /^[1-9]{1}.[1-9]{1}.[0-9]{4}$/.test(newDate) ||
            /^[1-9]{1}.[0-9]{2}.[0-9]{4}$/.test(newDate) ||
            /^[0-9]{2}.[1-9]{1}.[0-9]{4}$/.test(newDate)) {
            console.log("Date " + newDate + " passed regex");
            this.splitDate(newDate);

            let day = Number(this.splittedDate.day);
            let month = Number(this.splittedDate.month);
            let year = Number(this.splittedDate.year);
            if (day < 1 || month < 1 || year < 1 || month > 12 || day > 31) {
                return false;
            }

            return true;
        }
        return false;
    }

    splittedDate = {
        day: "",
        month: "",
        year: ""
    }

    formatDate(newDate) {
        this.splitDate(newDate);
        let date = this.splittedDate.year + "-" + this.splittedDate.month + "-" + this.splittedDate.day + "T00:00:00";
        return date;
    }

    splitDate(newDate) {
        let dateValues = newDate.split('.');
        this.splittedDate.day = dateValues[0];
        this.splittedDate.month = dateValues[1];
        this.splittedDate.year = dateValues[2];

        if (this.splittedDate.day.length == 1) {
            this.splittedDate.day = "0" + this.splittedDate.day;
        }

        if (this.splittedDate.month.length == 1) {
            this.splittedDate.month = "0" + this.splittedDate.month;
        }
    }
    
    renderUserActivityTable = (systemUsers) => {
        return (
            <div className='container-figma'>
                <table className='table-figma' aria-labelledby="tabelLabel">
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
                                <td><input style={this.inputStyle} value={systemUser.registrationDate}
                                    onChange={(event) => this.editDate("registrationDate", systemUser.id, event.target.value)}
                                    onBlur={(event) => this.checkDate("registrationDate", systemUser.id, event.target.value)} /></td>
                                <td><input style={this.inputStyle} value={systemUser.lastActivityDate}
                                    onChange={(event) => this.editDate("lastActivityDate", systemUser.id, event.target.value)}
                                    onBlur={(event) => this.checkDate("lastActivityDate", systemUser.id, event.target.value)}                                /></td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <button className="btn-figma mt-4" onClick={this.submitEditedDates}>Save</button>
                <br/>
                <button className="btn-figma mt-3" onClick={this.showHideRollingRetention}>
                    {!this.state.showRollingRetention && "Calculate" || "Hide"}
                </button>
                <br /><br />
                {this.state.showRollingRetention && <RollingRetention />}
            </div>

        );
    }

    // for some reason, scc class input-figma from custom.css doesn't get applied to inputs
    inputStyle = {
        border: "none",
        height: "45.47px",
        marginLeft: "auto",
        marginRight: "auto",
        textAlign: "center",
        boxSizing: "border-box",
        outline: "none",
        fontFamily: "Ubuntu",
        fontStyle: "normal",
        fontWeight: "300",
        fontSize: "14px",
        lineHeight: "16px",
        color: "#5D6E97"
    };

    showHideRollingRetention = () => {
        this.setState({ showRollingRetention: !this.state.showRollingRetention });
    }

    render() {
        const titleStyle = {            
            fontFamily: "Ubuntu",
            fontStyle: "normal",
            color: "#5D6E97"
        };

        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderUserActivityTable(this.state.systemUsers);

        return (
            <div>
                <h1 id="tabelLabel" style={titleStyle}>System users activity</h1>
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