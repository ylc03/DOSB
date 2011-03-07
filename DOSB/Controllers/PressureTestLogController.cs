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

using DOSB.Models;
using DOSB.Models.EditableModels;
using DOSB.Models.EditableRespositories;

namespace DOSB.Controllers
{
    public class PressureTestLogController : Controller
    {
        private CPLDataContext storeDB = new CPLDataContext();

        //
        // GET: /PressureTest/

        public ActionResult Index()
        {
            return View();
        }

        //
        // GET: /PressureTest/
        [GridAction]
        public ActionResult _SelectAjaxEdit()
        {
            return View(new GridModel(EditablePressureTestLogRespository.All()));
        }
        //
        // GET: /PressureTest/Details/5

        public ActionResult Details(int id)
        {
            var pressure_test = storeDB.PressureTests.Single(p => p.PressureTestId == id);
            return View(pressure_test);
        }

        //
        // GET: /PressureTest/Create

        public ActionResult Create()
        {
            return View();
        } 

        //
        // POST: /PressureTest/Create

        [HttpPost]
        public ActionResult Create(FormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }
        
        //
        // GET: /PressureTest/Edit/5
 
        public ActionResult Edit(int id)
        {
            return View();
        }

        //
        // POST: /PressureTest/Edit/5

        [HttpPost]
        public ActionResult Edit(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add update logic here
 
                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        //
        // GET: /PressureTest/Delete/5
 
        public ActionResult Delete(int id)
        {
            return View();
        }

        //
        // POST: /PressureTest/Delete/5

        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here
 
                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }
    }
}
