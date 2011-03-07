using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DOSB.Models
{
    public partial class Employee
    {
        public static bool AuthenticateByID(int id, string password)
        { 
            Employee employee = (new CPLDataContext()).Employees.FirstOrDefault(e => e.EmployeeId == id);
            return AuthenticateByLDAP(employee.LDAP, password);
        }

        public static bool AuthenticateByLDAP(string LDAP, string password)
        {
            return string.Equals(password, "ok");
        }
    }
}