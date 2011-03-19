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
            var data = from item in CPLStore.Instance.vwFields
                       select new
                       {
                           FieldId = item.FieldId,
                           Name = item.Name,
                           Client = item.Client,
                           Country = item.Country
                       };
            return Json(new {
                total = data.Count(),
                success = true,
                message = "",
                data = data   
            }, JsonRequestBehavior.AllowGet);    
        }

    }
}
