import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';

export class RollingRetention extends Component {
    static displayName = RollingRetention.name;

    constructor(props) {
        super(props);
        this.state = {
            labels: [],
            datasets: []
        };
    }

    chartDataSet = [
        {
            label: 'Users life duration',
            backgroundColor: 'blue',
            borderColor: 'rgba(0,0,0,1)',
            borderWidth: 2,
            data: []
        }
    ];

    componentDidMount() {
        this.populateChartData();
    }



    async populateChartData() {
        const response = await fetch('systemusers/getchartdata');
        const chartData = await response.json();
        let userIds = [];

        for (let item of chartData) {
            this.chartDataSet[0].data.push(item.activityDays);
            userIds.push(item.userId);
        }

        console.log("userIds: " + userIds);
        console.log("chartDataSet: " + this.chartDataSet[0]);

        this.setState({ labels: userIds, datasets: this.chartDataSet });
    }

    render() {
        return (
            <div>
                <p>Rolling Retention 7 day</p>
                <hr />
                <Bar
                    data={this.state}
                    options={{
                        title: {
                            display: true,
                            text: 'Average Rainfall per month',
                            fontSize: 20
                        },
                        legend: {
                            display: true,
                            position: 'right'
                        }
                    }}
                />
                
            </div>
        );
    }
}