using ABTestRealTest.Data.Interfaces;
using ABTestRealTest.Data.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace ABTestRealTest.Data.Services
{
    public class SpeedTestService : ISpeedTestService
    {
        private readonly IUsersDbService _usersDbService;
        private readonly IRollingRetentionService _retentionService;

        public SpeedTestService(IUsersDbService usersDbService,
                                IRollingRetentionService retentionService)
        {
            _usersDbService = usersDbService;
            _retentionService = retentionService;
        }

        public SpeedTestResults RunUsersSpeedTest()
        {
            var results = new SpeedTestResults();
            var stopWatch = new Stopwatch();

            stopWatch.Start();
            var users = _usersDbService.GetSystemUsers();
            stopWatch.Stop();
            results.GetUsersTime = (int)stopWatch.ElapsedMilliseconds;
            stopWatch.Reset();

            return results;
        }

        public async Task<SpeedTestResults> RunUserSpeedTestAsync()
        {
            var results = new SpeedTestResults();
            var stopWatch = new Stopwatch();

            stopWatch.Start();
            var user = await _usersDbService.GetSystemUserAsync(1);
            stopWatch.Stop();
            results.GetUserTime = (int)stopWatch.ElapsedMilliseconds;
            stopWatch.Reset();

            return results;
        }

        public SpeedTestResults RunRetentionSpeedTest()
        {
            var results = new SpeedTestResults();
            var stopWatch = new Stopwatch();

            stopWatch.Start();
            var retention = _retentionService.GetRollingRetentionXDay(7);
            stopWatch.Stop();
            results.GetRollingRetentionTime = (int)stopWatch.ElapsedMilliseconds;

            return results;
        }

        public SpeedTestResults CalculateChartData()
        {
            var results = new SpeedTestResults();
            var stopWatch = new Stopwatch();

            stopWatch.Start();
            var chartData = _retentionService.GetChartDataExclusive();
            stopWatch.Stop();
            results.CalculateChartDataTime = (int)stopWatch.ElapsedMilliseconds;

            return results;
        }
    }
}
