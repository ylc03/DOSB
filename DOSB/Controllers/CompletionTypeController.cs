using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using DOSB.Models;

namespace DOSB.Controllers
{
    public class CompletionTypeController : Controller
    {
        //
        // GET: /Country/

        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetJson()
        {
            var data = from item in new CPLDataContext().CompletionTypes
                       select new
                       {
                           CompTypeId = item.CompletionTypeId,
                           Name = item.Name
                       };
            return Json(data, JsonRequestBehavior.AllowGet);    
        }

    }
}
