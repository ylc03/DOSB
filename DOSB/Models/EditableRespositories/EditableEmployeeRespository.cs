using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using DOSB.Models.EditableModels;
using DOSB.Models;

namespace DOSB.Models.EditableRespositories
{
    public class EditableEmployeeRespository
    {
        /// <summary>
        /// All employees
        /// CPL LINQ to SQL model for read only, should removed later
        /// </summary>
        /// <returns>All editable employee</returns>
        public static IList<EditableEmployee> All()
        {
            IList<EditableEmployee> result =
                (IList<EditableEmployee>)HttpContext.Current.Session["employees"];
            if (result == null)
            {
                DOSBEntities storeDB = new DOSBEntities();
                result = new List<EditableEmployee>();

                foreach (var employee in storeDB.Employee.ToList())
                {
                    EditableEmployee editableEmployee = new EditableEmployee();
                    editableEmployee.EmployeeId = employee.EmployeeId;
                    editableEmployee.LDAP = employee.LDAP;
                    editableEmployee.GIN = employee.GIN;
                    editableEmployee.Mobile = employee.Mobile;
                    editableEmployee.SurName = employee.SurName;
                    editableEmployee.GivenName = employee.GivenName;
                    editableEmployee.SegmentId = employee.SegmentId.HasValue ? employee.SegmentId.Value : default(int);
                    editableEmployee.Segment = employee.Segment.Name;
                    editableEmployee.Status = employee.Status;
                    editableEmployee.Role = employee.Roles.Count() > 0 ? employee.Roles.First().Name : "";
                    editableEmployee.RoleId = employee.Roles.Count() > 0 ? employee.Roles.First().RoleId : 0;

                    result.Add(editableEmployee);
                }

                HttpContext.Current.Session["employees"] = result;
            }

            return result;
        }

        /// <summary>
        /// Find One Editable Employee
        /// </summary>
        /// <param name="predicate">predicate</param>
        /// <returns>an editable employee</returns>
        public static EditableEmployee One(Func<EditableEmployee, bool> predicate)
        {
            return All().Where(predicate).FirstOrDefault();
        }

        /// <summary>
        /// Insert new Employee
        /// </summary>
        /// <param name="employee">Editable Employee</param>
        public static void Insert(EditableEmployee employee)
        {
            employee.EmployeeId = All().OrderByDescending(p => p.EmployeeId).First().EmployeeId + 1;
            All().Insert(0, employee);
        }

        /// <summary>
        /// Update Employee
        /// </summary>
        /// <param name="employee">Editable Employee</param>
        public static void Update(EditableEmployee employee)
        {
            DOSBEntities storeDB = new DOSBEntities();
            Employee target = storeDB.Employee.First(e => e.EmployeeId == employee.EmployeeId);
            // segment from name to id
            Segment segment = storeDB.Segment.First(s => s.Name == employee.Segment);
            employee.SegmentId = segment.SegmentId;
            // role from name to id
            Role role = storeDB.Role.First(r => r.Name == employee.Role);
            if (target != null)
            {
                target.EmployeeId = employee.EmployeeId;
                target.LDAP = employee.LDAP;
                target.GIN = employee.GIN;
                target.Mobile = employee.Mobile;
                target.SurName = employee.SurName;
                target.GivenName = employee.GivenName;
                target.SegmentId = employee.SegmentId;
                target.Status = employee.Status;
                if (!target.Roles.Contains(role))
                {
                    target.Roles.Add(role);
                }
            }

            storeDB.SaveChanges();
        }

        /// <summary>
        /// Delete employee
        /// Currently not deleted from database.
        /// </summary>
        /// <param name="employee">Editable Employee</param>
        public static void Delete(EditableEmployee employee)
        {
            EditableEmployee target = One(p => p.EmployeeId == employee.EmployeeId);
            if (target != null)
            {
                All().Remove(target);
            }
        }
    }
}