using ABTestRealTest.Data.Interfaces;
using ABTestRealTest.Data.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ABTestRealTest.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SystemUsersController : ControllerBase
    {        
        private readonly ILogger<SystemUsersController> _logger;
        private readonly IUsersDbService _usersDbService;
        private readonly IRollingRetentionService _retentionService;
        private readonly ISpeedTestService _testService;

        public SystemUsersController(ILogger<SystemUsersController> logger,
                                     IUsersDbService usersDbService,
                                     IRollingRetentionService retentionService,
                                     ISpeedTestService testService)
        {
            _logger = logger;
            _usersDbService = usersDbService;
            _retentionService = retentionService;
            _testService = testService;
        }

        [HttpGet("[action]")]
        public IEnumerable<SystemUser> GetSystemUsers()
        {
            return _usersDbService.GetSystemUsers().ToArray();
        }

        [HttpGet("[action]/{id}")]
        public async Task<SystemUser> GetSystemUser(int id)
        {
            return await _usersDbService.GetSystemUserAsync(id);
        }

        [HttpPut("[action]")]
        public async Task<ActionResult<bool>> UpdateUsersDates(IEnumerable<SystemUser> systemUsers)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            return await _usersDbService.UpdateUsersDatesAsync(systemUsers);
        }

        [HttpGet("[action]")]
        public IEnumerable<ChartData> GetChartData()
        {
            return _retentionService.GetChartData().ToArray();
        }

        [HttpGet("[action]/{xDays}")]
        public RollingRetentionResult GetRollingRetentionXDay(int xDays)
        {
            return new RollingRetentionResult { Value = _retentionService.GetRollingRetentionXDay(xDays) };
        }

        [HttpGet("[action]")]
        public async Task<SpeedTestResults> GetSpeedTestResults()
        {
            return await _testService.RunSpeedTestAsync();
        }
    }
}
