using ABTestRealTest.Data.Interfaces;
using ABTestRealTest.Data.Models;
using Microsoft.Extensions.Logging;
using System;
using System.Collections;
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

        // Распределение живущих пользователей по месяцам.
        // В 1 месяц входят все, кто прожил 1 мес и более, и т.д.
        public IEnumerable<ChartData> GetChartDataInclusive()
        {               
            var data = new List<ChartData>();
            var users = _usersDbService.GetSystemUsers();

            List<int> usersLifesInMonthes = GetUserLifesInMonthes(users);

            int minMonths = usersLifesInMonthes.Min();
            int maxMonth = usersLifesInMonthes.Max();
            int monthsQty = maxMonth - minMonths + 1;

            var arrayOfMonthes = Enumerable.Range(minMonths, monthsQty).ToArray();

            foreach (var m in arrayOfMonthes)
            {
                data.Add(new ChartData
                    {
                        Month = m,
                        UsersQty = usersLifesInMonthes.Where(l => l >= m).Count()
                    }
                );                 
            }

            return data;
        }

        // Распределение живущих пользователей по месяцам.
        // В 1 месяц входят только те, кто прожил 1 мес, и т.д.
        public IEnumerable<ChartData> GetChartDataExclusive()
        {
            var data = new List<ChartData>();
            var users = _usersDbService.GetSystemUsers();

            List<int> usersLifesInMonthes = GetUserLifesInMonthes(users).OrderBy(l => l).ToList();

            var lastQtyOfMonthes = 0;
            
            foreach (var m in usersLifesInMonthes)
            {
                if (m != lastQtyOfMonthes)
                {
                    lastQtyOfMonthes = m;

                    data.Add(new ChartData
                            {
                                Month = m,
                                UsersQty = usersLifesInMonthes.Where(l => l == m).Count()
                            }
                    );
                }
                
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

        private List<int> GetUserLifesInMonthes(IEnumerable<SystemUser> users)
        {
            List<int> usersLifesInMonthes = new();

            foreach (var user in users)
            {
                var dateReg = user.RegistrationDate.GetValueOrDefault();
                var dateLast = user.LastActivityDate.GetValueOrDefault();

                usersLifesInMonthes.Add(((dateLast.Year - dateReg.Year) * 12) + dateLast.Month - dateReg.Month + 1);
            }

            return usersLifesInMonthes;
        }
    }
}
