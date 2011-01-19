using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.DirectoryServices;
using System.Drawing;
using System.IO;
using System.Globalization;

using Telerik.Web.Mvc.UI;
using Telerik.Web.Mvc;

using DOSB.viewModels;
using DOSB.Models;
using DOSB.Models.EditableModels;
using DOSB.Models.EditableRespositories;

namespace DOSB.Controllers
{
    public class EmployeeController : Controller
    {
        private DOSBEntities storeDB = new DOSBEntities();

        /// <summary>
        /// Show all employees
        /// </summary>
        /// <returns>Action Result</returns>
        public ActionResult Index()
        {
            ViewData["segments"] = GlobalConstant.GetSegments();
            ViewData["status"] = GlobalConstant.GetEmployeStatusList();
            return View();
        }

        /// <summary>
        /// Ajax List All Employee
        /// </summary>
        /// <returns>Action Result</returns>
        [GridAction]
        public ActionResult _SelectAjaxEdit()
        {
            ViewData["segments"] = GlobalConstant.GetSegments();
            ViewData["status"] = GlobalConstant.GetEmployeStatusList();
            return View(new GridModel(EditableEmployeeRespository.All()));
        }

        /// <summary>
        /// Ajax Update Employee model
        /// </summary>
        /// <param name="id">employee id</param>
        /// <returns>Action Result</returns>
        [HttpPost]
        [GridAction]
        public ActionResult _UpdateAjaxEdit(int id)
        {
            EditableEmployee employee = EditableEmployeeRespository.One(e => e.EmployeeId == id);

            if (TryUpdateModel(employee))
            {
                EditableEmployeeRespository.Update(employee);
            }
            return View(new GridModel(EditableEmployeeRespository.All()));
        }

        /// <summary>
        /// Ajax delete employee
        /// </summary>
        /// <param name="id">employee id</param>
        /// <returns>Actions Result</returns>
        [HttpPost]
        [GridAction]
        public ActionResult _DeleteAjaxEdit(int id)
        {
            EditableEmployee employee = EditableEmployeeRespository.One(e => e.EmployeeId == id);

            if (employee != null)
            {
                EditableEmployeeRespository.Delete(employee);
            }
            return View(new GridModel(EditableEmployeeRespository.All()));
        }

        /// <summary>
        /// Ajax Add employee from LDAP Server, support Add button on Grid Toolbar
        /// </summary>
        /// <param name="LDAP">LDAP Alias</param>
        /// <returns>Action Result</returns>
        [HttpPost]
        public ActionResult _AddFromLDAP(string LDAP)
        {
            // if employee already exists, use the employee in database to update data
            int count = storeDB.Employee.Count(s => s.LDAP == LDAP);
            if (count == 0)
            {
                Employee employee = new Employee();
                employee.LDAP = LDAP;

                // add LDAP information
                if (updateLDAPInfo(employee))
                {
                    // save to database
                    storeDB.AddToEmployee(employee);
                    storeDB.SaveChanges();
                    ViewData["message"] = employee.LDAP + " has been added!";
                }
                else
                {
                    ViewData["message"] = "Alias Not Found!";
                }
            }
            else
            {
                ViewData["message"] = "Alias already exist in DOSB system.";
            }

            //RedirectToAction("index", "Employee");
            return Content((string)ViewData["message"]);
        }

        /// <summary>
        /// Show avatar of Employee
        /// </summary>
        /// <param name="id">employee id</param>
        /// <returns>Return jpeg image of employee</returns>
        public ActionResult Avatar(int id)
        {
            if (id == 0)
            { 
                return File("/Content/Images/UnknownEmployee.jpg" ,"image/jpg");
            }

            Employee emp = storeDB.Employee.Single(e => e.EmployeeId == id);
            return File(emp.Avatar, "image/jpg");
        }
        
        ////
        //// Ajax: /Employee/Update/id

        //[HttpPost]
        //public ActionResult Update(int id)
        //{
        //    Employee employee = storeDB.Employee.Single(e => e.EmployeeId == id);
        //    if (updateLDAPInfo(employee))
        //    {
        //        storeDB.SaveChanges();
        //    }
        //    return View(employee);
        //}

        /// <summary>
        /// Update employee information from LDAP Server
        /// Should move to Employee model as static
        /// Should update editable employee respository as well
        /// </summary>
        /// <param name="employee">employee</param>
        /// <returns>If succeed, return true</returns>
        private bool updateLDAPInfo(Employee employee)
        {
            try
            {
                DirectoryEntry entry = new DirectoryEntry();
                entry.Path = "LDAP://ldap.slb.com/o=slb,c=an";
                entry.AuthenticationType = AuthenticationTypes.SecureSocketsLayer;
                DirectorySearcher searcher = new DirectorySearcher(entry);
                searcher.Filter = "(alias=" + employee.LDAP + ")";
                searcher.SearchScope = SearchScope.Subtree;
                SearchResult result = searcher.FindOne();
                if (result == null) return false;
                DirectoryEntry employeeEntry = result.GetDirectoryEntry();
                //NEEDTO Add if for empty properties
                employee.Avatar = (byte[])employeeEntry.Properties["jpegPhoto"][0];
                employee.SurName = (string)employeeEntry.Properties["surname"][0];
                employee.GivenName = (string)employeeEntry.Properties["givenName"][0];
                employee.GIN = (string)employeeEntry.Properties["employeeNumber"][0];
                if (String.IsNullOrEmpty(employee.Status))
                {
                    employee.Status = "Base";
                }
                if (employeeEntry.Properties.Contains("mobile"))
                {
                    employee.Mobile = (string)employeeEntry.Properties["mobile"][0];
                }
                if (employeeEntry.Properties.Contains("personalMobile"))
                {
                    employee.PersonalMobile = (string)employeeEntry.Properties["personalMobile"][0];
                }
                string businessCategory = (string)employeeEntry.Properties["businessCategory"][0];
                try
                {
                    Segment subSegment = storeDB.Segment.Single(s => s.BusinessCategory == businessCategory);
                    if (subSegment != null)
                    {
                        employee.Segment = subSegment;
                    }
                }
                catch (Exception e)
                {
                    ViewData["ldap_message"] = "This LDAP is not RMC, CC or SMS";
                    return false;
                }
            }
            catch (System.Runtime.InteropServices.COMException ne)
            {
                ViewData["ldap_message"] = "LDAP ERROR: " + ne.Message + " [" + ne.ErrorCode + "]";
            }

            return true;
        }
    }
}
