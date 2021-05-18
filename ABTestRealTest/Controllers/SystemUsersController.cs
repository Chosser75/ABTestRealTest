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
        //private static readonly string[] Summaries = new[]
        //{
        //    "Freezing1", "Bracing1", "Chilly1", "Cool1", "Mild1", "Warm1", "Balmy1", "Hot1", "Sweltering1", "Scorching1"
        //};

        //[HttpGet("[action]")]
        //public IEnumerable<WeatherForecast> GetTemps()
        //{
        //    var rng = new Random();
        //    return Enumerable.Range(1, 5).Select(index => new WeatherForecast
        //    {
        //        Date = DateTime.Now.AddDays(index),
        //        TemperatureC = rng.Next(-20, 55),
        //        Summary = Summaries[rng.Next(Summaries.Length)]
        //    })
        //    .ToArray();
        //}






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
            return _usersDbService.GetSystemUsers().ToArray();
        }

        [HttpGet("[action]/{id}")]
        public async Task<SystemUser> GetSystemUser(int id)
        {
            return await _usersDbService.GetSystemUserAsync(id);
        }

        [HttpPut("[action]")]
        public async Task<bool> UpdateUsersDates(IEnumerable<SystemUser> systemUsers)
        {
            return await _usersDbService.UpdateUsersDatesAsync(systemUsers);
        }
    }
}
