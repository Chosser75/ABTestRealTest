using ABTestRealTest.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ABTestRealTest.Data.Interfaces
{
    public interface ISpeedTestService
    {
        SpeedTestResults RunUsersSpeedTest();
        Task<SpeedTestResults> RunUserSpeedTestAsync();
        SpeedTestResults RunRetentionSpeedTest();
        SpeedTestResults CalculateChartData();
    }
}
