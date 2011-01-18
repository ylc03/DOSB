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
        public static IList<EditableEmployee> All()
        {
            IList<EditableEmployee> result =
                (IList<EditableEmployee>)HttpContext.Current.Session["employees"];
            if (result == null)
            {
                HttpContext.Current.Session["employees"] = result =
                    (from employee in new CPLDataContext().Employees
                     select new EditableEmployee
                     {
                         EmployeeId = employee.EmployeeId,
                         LDAP = employee.LDAP,
                         GIN = employee.GIN,
                         Mobile = employee.Mobile,
                         SurName = employee.SurName,
                         GivenName = employee.GivenName,
                         Segment = employee.SegmentId.HasValue ? employee.SegmentId.Value : default(int),
                         Status = employee.Status
                     }).ToList();
            }
            return result;
        }
        public static EditableEmployee One(Func<EditableEmployee, bool> predicate)
        {
            return All().Where(predicate).FirstOrDefault();
        }
        public static void Insert(EditableEmployee employee)
        {
            employee.EmployeeId = All().OrderByDescending(p => p.EmployeeId).First().EmployeeId + 1;
            All().Insert(0, employee);
        }
        public static void Update(EditableEmployee employee)
        {
            DOSBEntities storeDB = new DOSBEntities();
            Employee target = storeDB.Employee.First(e => e.EmployeeId == employee.EmployeeId);
            if (target != null)
            {
                         target.EmployeeId = employee.EmployeeId;
                         target.LDAP = employee.LDAP;
                         target.GIN = employee.GIN;
                         target.Mobile = employee.Mobile;
                         target.SurName = employee.SurName;
                         target.GivenName = employee.GivenName;
                         target.SegmentId = employee.Segment;
                         target.Status = employee.Status;
            }

            storeDB.SaveChanges();
        }
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