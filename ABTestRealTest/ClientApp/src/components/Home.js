import React, { Component } from 'react';
import '../custom.css';

export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);
        this.state = {
            getUsersTime: 0,
            getUserTime: 0,
            getRollingRetentionTime: 0,
            calculateChartDataTime: 0
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
                        Fetch all system users from DB elapsed time: {this.state.getUsersTime} milliseconds
                    </div>
                    <div className="form-group">
                        Fetch system user by Id from DB elapsed time: {this.state.getUserTime} milliseconds
                    </div>
                    <div className="form-group">
                        Calculate rolling retention elapsed time: {this.state.getRollingRetentionTime} milliseconds
                    </div>
                    <div className="form-group">
                        Calculate chart data elapsed time: {this.state.calculateChartDataTime} milliseconds
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

        response = await fetch('systemusers/RunUserSpeedTest');
        data = await response.json();
        this.setState({ getUserTime: data.getUserTime });

        response = await fetch('systemusers/RunRetentionSpeedTest');
        data = await response.json();
        this.setState({ getRollingRetentionTime: data.getRollingRetentionTime });   

        response = await fetch('systemusers/CalculateChartDataTest');
        data = await response.json();
        this.setState({ calculateChartDataTime: data.calculateChartDataTime });
    }
}
