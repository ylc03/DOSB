using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;

using DOSB.Models;

namespace DOSB.Util
{
    public class LDAPRoleProvider : RoleProvider
    {
        private CPLDataContext storeDB = new CPLDataContext();

        public override string[] GetRolesForUser(string username)
        {
            try
            {
                List<string> roles = new List<string>();
                Employee employee = storeDB.Employees.First(e => e.LDAP == username);
                for(int i=0; i<employee.EmployeeRoles.Count; i++)
                {
                    roles[i] = employee.EmployeeRoles.ElementAt(i).Role.Name;
                }

                return roles.ToArray();
            }
            catch (Exception e)
            {
                return null;
            }
        }

        public override void AddUsersToRoles(string[] usernames, string[] roleNames)
        {
            throw new NotImplementedException();
        }

        public override string ApplicationName
        {
            get
            {
                throw new NotImplementedException();
            }
            set
            {
                throw new NotImplementedException();
            }
        }

        public override void CreateRole(string roleName)
        {
            throw new NotImplementedException();
        }

        public override bool DeleteRole(string roleName, bool throwOnPopulatedRole)
        {
            throw new NotImplementedException();
        }

        public override string[] FindUsersInRole(string roleName, string usernameToMatch)
        {
            throw new NotImplementedException();
        }

        public override string[] GetAllRoles()
        {
            throw new NotImplementedException();
        }

        public override string[] GetUsersInRole(string roleName)
        {
            throw new NotImplementedException();
        }

        public override bool IsUserInRole(string username, string roleName)
        {
            throw new NotImplementedException();
        }

        public override void RemoveUsersFromRoles(string[] usernames, string[] roleNames)
        {
            throw new NotImplementedException();
        }

        public override bool RoleExists(string roleName)
        {
            throw new NotImplementedException();
        }

    }
}