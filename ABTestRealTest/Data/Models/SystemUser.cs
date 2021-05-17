using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ABTestRealTest.Data.Models
{
    public class SystemUser
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime? RegistrationDate { get; set; }
        public DateTime? LastActivityDate { get; set; }
    }
}
