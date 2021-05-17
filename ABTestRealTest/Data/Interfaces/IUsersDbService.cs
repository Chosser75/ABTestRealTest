using ABTestRealTest.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ABTestRealTest.Data.Interfaces
{
    public interface IUsersDbService
    {
        IEnumerable<SystemUser> GetSystemUsers();
        Task<bool> UpdateUsersDatesAsync(IEnumerable<SystemUser> systemUsers);
    }
}
