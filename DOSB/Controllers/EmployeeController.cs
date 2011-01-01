using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DOSB.Models;
using DOSB.viewModels;

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
                storeDB.AddToEmployee(employee);
                storeDB.SaveChanges();

                RedirectToAction("index", "Home");
            }

            var viewModel = new EmployeeManagerViewModel
            {
                Employee = employee,
                SubSegments = storeDB.Segment.Where(s => s.ParentId == 4).ToList()
            };
            return View(viewModel);
        }
    }
}
