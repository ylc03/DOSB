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
        //
        // GET: /Well/

        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetJson()
        {
            var data = from item in new CPLDataContext().Wells
                       select new
                       {
                           WellId = item.WellId,
                           Name = item.Name
                       };

            return Json(data, JsonRequestBehavior.AllowGet);
        }
    }
}
