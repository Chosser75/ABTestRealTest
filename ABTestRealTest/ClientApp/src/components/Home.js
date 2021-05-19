import React, { Component } from 'react';

export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);
        this.state = {
            speedTestResults: {
                getUsersTime: 0,
                getUserTime: 0,
                getRollingRetentionTime: 0
            }
        };

        this.runServerSpeedTest = this.runServerSpeedTest.bind(this);
    }

    render () {
        return (
            <div>
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
                        GetUsers elapsed time: {this.state.speedTestResults.getUsersTime} milliseconds
                    </div>
                    <div className="form-group">
                        GetUser elapsed time: {this.state.speedTestResults.getUserTime} milliseconds
                    </div>
                    <div className="form-group">
                        GetRollingRetention elapsed time: {this.state.speedTestResults.getRollingRetentionTime} milliseconds
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary mt-4" onClick={this.runServerSpeedTest}>
                            Run server speed test
                    </button>
                    </div>                   
                </div> 
            </div>
        );
    }

    async runServerSpeedTest() {
        const response = await fetch('systemusers/getspeedtestresults');
        var data = await response.json();
        this.setState({ speedTestResults: data });
    }
}
