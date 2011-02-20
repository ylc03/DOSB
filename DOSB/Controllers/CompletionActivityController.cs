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
        private DOSBEntities storeDB = new DOSBEntities();

        //
        // GET: /CompletionActivity/


        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// Ajax List Activities
        /// </summary>
        /// <returns>Action Result</returns>
        [GridAction]
        public ActionResult _SelectAjax()
        { 
            return View(new GridModel(EditableCompletionActivityRespository.ActivitiesOnMonth(DateTime.Now)));
        }
    }
}
