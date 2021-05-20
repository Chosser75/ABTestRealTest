import React, { Component } from 'react';
import '../custom.css'

export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);
        this.state = {
            getUsersTime: 0,
            getUserTime: 0,
            getRollingRetentionTime: 0
        };

        this.runServerSpeedTests = this.runServerSpeedTests.bind(this);
    }

    render() {
        const titleStyle = {
            fontFamily: "Ubuntu",
            fontStyle: "normal",
            color: "#5D6E97"
        };
        
        return (
            <div style={titleStyle}>
                <h2>Hello, AB TEST REAL!</h2>
                <hr/>
                <h4>Daulet Kshibekov's test task</h4>
                <hr />
                <p>Please refer to the main menu items.</p>
                <br /><br />
                <hr />
                <br /><br />
                <div>
                    <div className="form-group">
                        GetUsers elapsed time: {this.state.getUsersTime} milliseconds
                    </div>
                    <div className="form-group">
                        GetUser elapsed time: {this.state.getUserTime} milliseconds
                    </div>
                    <div className="form-group">
                        GetRollingRetention elapsed time: {this.state.getRollingRetentionTime} milliseconds
                    </div>
                    <div className="form-group">
                        <button className="btn-figma mt-4" onClick={this.runServerSpeedTests}>
                            Run server speed test
                    </button>
                    </div>                   
                </div> 
            </div>
        );
    }

    
    async runServerSpeedTests() {
        var response = await fetch('systemusers/RunUsersSpeedTest');
        var data = await response.json();
        this.setState({ getUsersTime: data.getUsersTime });

        var response = await fetch('systemusers/RunUserSpeedTest');
        var data = await response.json();
        this.setState({ getUserTime: data.getUserTime });

        var response = await fetch('systemusers/RunRetentionSpeedTest');
        var data = await response.json();
        this.setState({ getRollingRetentionTime: data.getRollingRetentionTime });       
    }
}
