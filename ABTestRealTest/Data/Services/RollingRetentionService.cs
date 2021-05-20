using ABTestRealTest.Data.Interfaces;
using ABTestRealTest.Data.Models;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace ABTestRealTest.Data.Services
{
    public class RollingRetentionService : IRollingRetentionService
    {
        private readonly ILogger<RollingRetentionService> _logger;
        private readonly IUsersDbService _usersDbService;

        public RollingRetentionService(ILogger<RollingRetentionService> logger,
                                     IUsersDbService usersDbService)
        {
            _logger = logger;
            _usersDbService = usersDbService;
        }

        public IEnumerable<ChartData> GetChartData()
        {
            var data = new List<ChartData>();
            var users = _usersDbService.GetSystemUsers();

            foreach (var user in users)
            {
                data.Add(new ChartData
                {
                    UserId = user.Id,
                    ActivityDays = (user.LastActivityDate.GetValueOrDefault() - user.RegistrationDate.GetValueOrDefault()).Days
                });
            }

            return data;
        }

        public double GetRollingRetentionXDay(int xDay)
        {
            double returnedUsersCount = 0;
            double registeredUsersCount = 0;

            var users = _usersDbService.GetSystemUsers();

            returnedUsersCount = (double)users.Where(u => (u.LastActivityDate.GetValueOrDefault() 
                        - u.RegistrationDate.GetValueOrDefault()).Days >= xDay).Count();

            registeredUsersCount = (double)users.Where(u => (DateTime.Now
                        - u.RegistrationDate.GetValueOrDefault()).Days >= xDay).Count();

            return Math.Round(registeredUsersCount == 0 ? 0 : returnedUsersCount / registeredUsersCount * 100, 2);
        }
    }
}
