using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using Telerik.Web.Mvc;

using DOSB.Models;
using DOSB.Models.EditableModels;
using DOSB.Models.EditableRespositories;

namespace DOSB.Controllers
{
    public class WorkshopDailyActivityController : Controller
    {
        //
        // GET: /WorkshopDailyActivity/

        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// Ajax List 
        /// </summary>
        /// <returns>Action Result</returns>
        [GridAction]
        public ActionResult _SelectAjax(DateTime date)
        {
            IList<EditableActivity> activities;

            if (date.Date == DateTime.Today)
            {
                activities = EditableActivityRespository.Today();
            }
            else
            {
                activities = EditableActivityRespository.ActivitiesOn(date);
            }

            return View(new GridModel(activities));
        }
    }
}
