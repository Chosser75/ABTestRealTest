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

        public SystemUsersController(ILogger<SystemUsersController> logger,
                                     IUsersDbService usersDbService)
        {
            _logger = logger;
            _usersDbService = usersDbService;
        }

        [HttpGet("[action]")]
        public IEnumerable<SystemUser> GetSystemUsers()
        {
            return _usersDbService.GetSystemUsers();
        }

        [HttpPut("[action]")]
        public async Task<bool> UpdateUsersDates(IEnumerable<SystemUser> systemUsers)
        {
            return await _usersDbService.UpdateUsersDatesAsync(systemUsers);
        }
    }
}
