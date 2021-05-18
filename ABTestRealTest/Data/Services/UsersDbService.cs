using ABTestRealTest.Data.Interfaces;
using ABTestRealTest.Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ABTestRealTest.Data.Services
{
    public class UsersDbService : IUsersDbService
    {
        private readonly ILogger<UsersDbService> _logger;
        private readonly UsersDbContext _usersDbContext;
        private readonly IConfiguration _configuration;

        public UsersDbService(UsersDbContext usersDbContext,
                              ILogger<UsersDbService> logger,
                              IConfiguration configuration)
        {
            _usersDbContext = usersDbContext;
            _logger = logger;
            _configuration = configuration;
        }

        public async Task<SystemUser> GetSystemUserAsync(int id) => await _usersDbContext.SystemUsers.
                                                                            FirstOrDefaultAsync(u => u.Id == id) ?? new SystemUser();

        public IEnumerable<SystemUser> GetSystemUsers() => _usersDbContext.SystemUsers.AsNoTracking();

        public async Task<bool> UpdateUsersDatesAsync(IEnumerable<SystemUser> systemUsers)
        {
            if (systemUsers is null || !systemUsers.Any())
            {
                return false;
            }

            _usersDbContext.UpdateRange(systemUsers);
            
            return await SaveChangesAsync();
        } 

        private async Task<bool> SaveChangesAsync()
        {
            var isProcessed = false;
            var timeout = _configuration.GetValue<double>("DbTimeout");
            DateTime startTime = DateTime.Now;

            while (!isProcessed)
            {
                try
                {
                    await _usersDbContext.SaveChangesAsync();
                    isProcessed = true;
                }
                catch (DbUpdateConcurrencyException dbex)
                {
                    _logger.LogError(dbex, "Concurrency error saving data.");
                    if (DateTime.Now > startTime.AddMilliseconds(timeout))
                    {
                        return false;
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error saving data.");
                    return false;
                }
            }

            return true;
        }
    }
}
