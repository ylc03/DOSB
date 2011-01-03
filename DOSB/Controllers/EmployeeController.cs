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
            var employee = storeDB.Employee.Include("Segment").ToList();

            return View(employee);
        }

        // **************************************
        // URL: /Employee/Add
        // **************************************
        //[Authorize]
        public ActionResult Add()
        {
            var viewModel = new EmployeeManagerViewModel
            {
                Employee = new Employee(),
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
                // add LDAP information
                if (UpdateLDAPInfo(employee.LDAP))
                {
                    // save to database
                    storeDB.AddToEmployee(employee);
                    storeDB.SaveChanges();
                }
                else
                {
                    ViewData["message"] = "LDAP Not Found!";
                }

                RedirectToAction("index", "Home");
            }

            var viewModel = new EmployeeManagerViewModel
            {
                Employee = employee,
                SubSegments = storeDB.Segment.Where(s => s.ParentId == 4).ToList()
            };
            return View(viewModel);
        }

        private bool UpdateLDAPInfo(string alias)
        {
            try
            {
                DirectoryEntry entry = new DirectoryEntry();
                entry.Path = "LDAP://ldap.slb.com/o=slb,c=an";
                entry.AuthenticationType = AuthenticationTypes.SecureSocketsLayer;
                DirectorySearcher searcher = new DirectorySearcher(entry);
                searcher.Filter = "(alias=" + alias + ")";
                searcher.SearchScope = SearchScope.Subtree;
                SearchResultCollection results = searcher.FindAll();
                if (results.Count == 0) return false;
                SearchResult res = results[0];

                DirectoryEntry employeeEntry = res.GetDirectoryEntry();

                var avatarEntry = employeeEntry.Properties["jpegPhoto"];

            }
            catch (System.Runtime.InteropServices.COMException ne)
            {
                ViewData["ldap_message"] = "LDAP ERROR: " + ne.Message + " [" + ne.ErrorCode + "]";
            }

            return true;
        }
    }
}
