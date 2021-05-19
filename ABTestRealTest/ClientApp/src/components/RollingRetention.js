import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';

export class RollingRetention extends Component {
    static displayName = RollingRetention.name;

    constructor(props) {
        super(props);
        this.state = {
            labels: [],
            datasets: [],
            rollingRetensionXDay: 0
        };

        this.GetRollingRetentionXDay = this.GetRollingRetentionXDay.bind(this);
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

        this.GetRollingRetentionXDay(7);

        this.setState({ labels: userIds, datasets: this.chartDataSet });
    }

    render() {
        return (
            <div>
                <p>Rolling Retention 7 day: {this.state.rollingRetensionXDay}</p>
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

    async GetRollingRetentionXDay(xDay) {
        const response = await fetch('systemusers/getrollingretentionxday/' + xDay);        
        var data = await response.json();
        this.setState({ rollingRetensionXDay:data.value });
    }
}