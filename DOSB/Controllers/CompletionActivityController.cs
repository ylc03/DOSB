using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using Telerik.Web.Mvc.UI;
using Telerik.Web.Mvc;

using DOSB.Models;
using DOSB.Models.EditableModels;
using DOSB.Models.EditableRespositories;

namespace DOSB.Controllers
{
    public class CompletionActivityController : Controller
    {
        private CPLDataContext storeDB = new CPLDataContext();

        //
        // GET: /CompletionActivity/


        public ActionResult Index()
        {
         //   EditableRigActivityRespository.ActivitiesOnMonth(new DateTime(2010, 12, 5));
            return View(EditableRigActivityRespository.All());
        }


        /// <summary>
        /// Ajax List All Torque
        /// </summary>
        /// <returns>Action Result</returns>
        [GridAction]
        public ActionResult _SelectAjax()
        {
            Telerik.Web.Mvc.GridModel grid = new GridModel(EditableRigActivityRespository.All());

            return View(grid);
        }

     
        public ActionResult _EditAjax(int id)
        {
            EditableRigActivity target;
            if (id == 0)
            {
                target = new EditableRigActivity();
            }
            else
            {
                target = EditableRigActivityRespository.One(ra => ra.RigActivityId == id);
            }

           ///?????? ViewData["employees"] = GlobalConstant.GetAllEmployees();
            return View(target);
        }

        public ActionResult CustomHeaderJS()
        {
            CPLDataContext storeDB = CPLStore.Instance;

            ViewData["upper"] = storeDB.vwUpperCompletionAssemblies.ToList();
            ViewData["upperCount"] = storeDB.vwUpperCompletionAssemblies.Count();
            ViewData["lower"] = storeDB.vwLowerCompletionAssemblies.ToList();
            ViewData["lowerCount"] = storeDB.vwLowerCompletionAssemblies.Count();
            ViewData["Company"] = EditableCompanyRespository.All().ToList();
            return View();
        }

        public JsonResult GetJson()
        {
            var data = EditableCompletionActivityRespository.AllMapToTime();
            return Json(new {
                total = data.Count(),
                success = true,
                message = "All Completion activities",
                data = data
            }, JsonRequestBehavior.AllowGet);
        }
        
    }
}
