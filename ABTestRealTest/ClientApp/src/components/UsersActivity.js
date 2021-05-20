import React, { Component } from 'react';
import '../custom.css'
import { RollingRetention } from './RollingRetention';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import MaskedInput from 'react-maskedinput';

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
    }

    componentDidMount() {
        this.populateSystemUsers();
    }

    
    flipDate(date) {
        let dateValues = date.split('.');
        return dateValues[2] + "-" + dateValues[1] + "-" + dateValues[0];
    }

    formatDate(newDate) {
        return this.flipDate(newDate) + "T00:00:00";
    }

    async submitEditedDates() {
        //var editedUsers = Object.assign([], this.state.systemUsers); // doesn't work

        for (var user of this.state.systemUsers) {
            user.registrationDate = this.formatDate(new Date(user.registrationDate).toLocaleDateString());
            user.lastActivityDate = this.formatDate(new Date(user.lastActivityDate).toLocaleDateString());
        }

        const response = await fetch('systemusers/updateusersdates', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.systemUsers)
        })
            .catch(err => console.log(err));

        this.convertToDatePickerDates(this.state.systemUsers);

        this.setState({ systemUsers: this.state.systemUsers, showRollingRetention: false });

        if (response.ok) {
            alert("Data is successfully saved to DB");
        }
        else {
            alert("Error!!! Data was not saved.");
        }
    }

    setDate(field, id, newDate) {
        var user = this.getUserById(id);

        if (field === "registrationDate") {
            user.registrationDate = newDate;
        }
        else {
            user.lastActivityDate = newDate;
        }

        this.setState({
            systemUsers: this.state.systemUsers
        });
    }
        
    getUserById = (id) => {
        for (var user of this.state.systemUsers) {
            if (user.id === id) {
                return user;
            }
        }
    }

    validRangeRegisterDate = () => {

    }

    convertToDatePickerDates(data) {
        for (let user of data) {
            if (user.registrationDate !== "0") {
                user.registrationDate = new Date(user.registrationDate);
            }
            if (user.lastActivityDate !== "0") {
                user.lastActivityDate = new Date(user.lastActivityDate);
            }
        }
    }

    //------------------------------------------------------------------------------------------------------------------
    
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
                                <td>
                                    <DatePicker
                                        dateFormat="dd.MM.yyyy"
                                        customInput={
                                            <MaskedInput mask="11.11.1111" placeholder="dd.mm.yyyy" />
                                        }
                                        selected={systemUser.registrationDate}
                                        onChange={date => this.setDate("registrationDate", systemUser.id, date)}
                                        filterDate={date => date <= systemUser.lastActivityDate }
                                    />
                                </td>
                                <td>
                                    <DatePicker
                                        dateFormat="dd.MM.yyyy"
                                        customInput={
                                            <MaskedInput mask="11.11.1111" placeholder="dd.mm.yyyy" />
                                        }
                                        selected={systemUser.lastActivityDate}
                                        onChange={date => this.setDate("lastActivityDate", systemUser.id, date)}
                                        filterDate={date => date >= systemUser.registrationDate}
                                    />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <button className="btn-figma mt-4" onClick={this.submitEditedDates}>Save</button>
                <br/>
                <button className="btn-figma mt-3" onClick={this.showHideRollingRetention}>
                    Calculate
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
        this.setState({ showRollingRetention: true });
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
        this.convertToDatePickerDates(data);
        this.setState({ systemUsers: data, loading: false });
    }

    async getUserFromDb(id) {
        const response = await fetch('systemusers/getsystemuser/' + id );
        return await response.json();
    }    
}