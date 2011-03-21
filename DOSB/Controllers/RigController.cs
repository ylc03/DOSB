using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using DOSB.Models;

namespace DOSB.Controllers
{
    public class RigController : Controller
    {
        private CPLDataContext store = new CPLDataContext();

        //
        // GET: /Rig/

        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetJson()
        {
            var data = from item in store.Rigs
                       select new
                       {
                           RigId = item.RigId,
                           Name = item.Name,
                           Type = item.Type,
                       };

            return Json(new {
                total = data.Count(),
                success = true,
                message = "Return new all rigs",
                data = data,
            }, JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetByTimeSpan(DateTime? startDate, DateTime? endDate)
        {
            var data = from item in store.fnFilterRigs(startDate, endDate)
                       select new
                       {
                           RigId = item.RigId,
                           Name = item.Name,
                           EngId = item.DeskEngId
                       };

            return Json(new
            {
                total = data.Count(),
                success = true,
                message = "Return new all rigs",
                data = data,
            }, JsonRequestBehavior.AllowGet);
        }
    }
}
