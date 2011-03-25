using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using DOSB.Models;

namespace DOSB.Controllers
{
    public class WellController : Controller
    {
        CPLDataContext store = new CPLDataContext();
        //
        // GET: /Well/

        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetJson()
        {
            var data = from item in store.vwWells
                       select item;

            return Json(new { 
                total = data.Count(),
                success = true,
                message = "Wells listed.",
                data = data
            }, JsonRequestBehavior.AllowGet);
        }
    }
}
