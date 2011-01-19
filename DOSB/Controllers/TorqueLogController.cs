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
    public class TorqueLogController : Controller
    {
        private DOSBEntities storeDB = new DOSBEntities();

        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// Ajax List All Torque
        /// </summary>
        /// <returns>Action Result</returns>
        [GridAction]
        public ActionResult _SelectAjaxEdit()
        {
            return View(new GridModel(EditableTorqueLogRespository.All()));
        }
    }
}
