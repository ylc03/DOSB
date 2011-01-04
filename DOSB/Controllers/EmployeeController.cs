using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.DirectoryServices;

using DOSB.Models;
using DOSB.viewModels;
using System.Drawing;
using System.IO;

namespace DOSB.Controllers
{
    public class EmployeeController : Controller
    {
        private DOSBEntities storeDB = new DOSBEntities();

        //
        // GET: /Employee/

        public ActionResult Index()
        {
            var viewModel = new EmployeeManagerViewModel
            {
                AllEmployees = storeDB.Employee.Include("Segment").ToList(),
                SubSegments = storeDB.Segment.Where(s => s.ParentId == 4).ToList(),
                Status = GlobalConstant.EMPLOYEE_STATUS,
            };
            return View(viewModel);
        }


        // **************************************
        // URL: /Employee/Add
        // **************************************
        //[Authorize]
        public ActionResult Add()
        {
            var viewModel = new EmployeeManagerViewModel
            {
                CurrentEmployee = new Employee(),
                SubSegments = storeDB.Segment.Where(s => s.ParentId == 4).ToList(),
                Status = DOSB.GlobalConstant.EMPLOYEE_STATUS
            };
            return View(viewModel);
        }

        //[Authorize]
        [HttpPost]
        public ActionResult Add(Employee employee)
        {
            if (ModelState.IsValid)
            {
                // if employee already exists, use the employee in database to update data
                int count = storeDB.Employee.Count(s => s.LDAP == employee.LDAP);
                if (count == 0)
                {
                    // add LDAP information
                    if (UpdateLDAPInfo(employee))
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

                RedirectToAction("index", "Employee");
            }

            var viewModel = new EmployeeManagerViewModel
            {
                CurrentEmployee = employee,
                SubSegments = storeDB.Segment.Where(s => s.ParentId == 4).ToList()
            };
            return View(viewModel);
        }

        //
        // GET: /Employee/Avatar/id

        public ActionResult Avatar(int id)
        {
            Employee emp = storeDB.Employee.Single(e => e.EmployeeId == id);
            return File(emp.Avatar, "image/jpg");
        }

        //
        // Ajax: /Employee/UpdateStatus/ :id, :status
        [HttpPost]
        public ActionResult UpdateStatus(int id, string status)
        {

            Employee employee = storeDB.Employee.Single(e => e.EmployeeId == id);
            employee.Status = status;
            storeDB.SaveChanges();
            return null;
        }

        // Ajax: /Employee/UpdateSubSegmant/ :id, :segmentId
        [HttpPost]
        public ActionResult UpdateSubSegment(int id, int segmentId)
        {

            Employee employee = storeDB.Employee.Single(e => e.EmployeeId == id);
            employee.SegmentId = segmentId;
            storeDB.SaveChanges();
            return null;
        }

        //
        // Ajax: /Employee/Update/id

        [HttpPost]
        public ActionResult Update(int id)
        {
            Employee employee = storeDB.Employee.Single(e => e.EmployeeId == id);
            if (UpdateLDAPInfo(employee))
            {
                storeDB.SaveChanges();
            }
            return View(employee);
        }

        //
        // Ajax: /Employee/Delete/id

        [HttpPost]
        public ActionResult Delete(int id)
        {
            Employee employee = storeDB.Employee.Single(e => e.EmployeeId == id);
            storeDB.Employee.DeleteObject(employee);
            storeDB.SaveChanges();
            return Content("");
        }

        //
        // update
        private bool UpdateLDAPInfo(Employee employee)
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

                //string fileName = Environment.GetFolderPath(Environment.SpecialFolder.Personal) + "\\" + employee.LDAP + ".jpg";
                //if (System.IO.File.Exists(fileName))
                //{
                //    FileStream fileStream = new FileStream(fileName, FileMode.Open);
                //    byte[] buff = new byte[2048];
                //    fileStream.Read(buff, 0, (int)fileStream.Length);
                //    employee.Avatar = buff;
                //    fileStream.Close();
                //}
                //else
                //{
                //    return false;
                //}
            }
            catch (System.Runtime.InteropServices.COMException ne)
            {
                ViewData["ldap_message"] = "LDAP ERROR: " + ne.Message + " [" + ne.ErrorCode + "]";
            }

            return true;
        }
    }
}
