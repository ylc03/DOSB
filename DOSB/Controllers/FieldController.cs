using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using DOSB.Models;

namespace DOSB.Controllers
{
    public class FieldController : Controller
    {
        //
        // GET: /Country/

        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetJson()
        {
            var data = from item in CPLStore.Instance.Fields
                       select new
                       {
                           FieldId = item.FieldId,
                           Name = item.Name
                       };
            return Json(data, JsonRequestBehavior.AllowGet);    
        }

    }
}
