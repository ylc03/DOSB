using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

using DOSB.Models;
using DOSB.Models.EditableModels;
using DOSB.Models.EditableRespositories;

namespace DOSB.Controllers
{
    public class RigActivityController : Controller
    {
        CPLDataContext store = new CPLDataContext();
        //
        // GET: /RigActivity/

        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetJson()
        {
            return Json(new {
                total = EditableRigActivityRespository.All().Count(),
                success = true,
                message = "Return new all rig activities",
                data = EditableRigActivityRespository.All(),
            }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetByTimeSpan(DateTime startDate, DateTime endDate)
        {
            var data = EditableRigActivityRespository.AllByTimeSpan(startDate, endDate);

            return Json(new
            {
                total = data.Count(),
                success = true,
                message = "Rig list returned.",
                data = data,
            }, JsonRequestBehavior.AllowGet);
        }

    }
}
