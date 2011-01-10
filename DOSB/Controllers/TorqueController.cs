using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DOSB.Models;

namespace DOSB.Controllers
{
    public class TorqueController : Controller
    {
        private DOSBEntities storeDB = new DOSBEntities();

        //
        // GET: /Torque/

        public ActionResult Index()
        {
            var model = storeDB.Torque.OrderByDescending(t => t.TorqueId ).ToList();

            return View(model);
        }

        //
        // GET: /Torque/Details/5

        public ActionResult Details(int id)
        {
            return View();
        }

        //
        // GET: /Torque/Create

        public ActionResult Create()
        {
            return View();
        } 

        //
        // POST: /Torque/Create

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
        // GET: /Torque/Edit/5
 
        public ActionResult Edit(int id)
        {
            return View();
        }

        //
        // POST: /Torque/Edit/5

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
        // GET: /Torque/Delete/5
 
        public ActionResult Delete(int id)
        {
            return View();
        }

        //
        // POST: /Torque/Delete/5

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
