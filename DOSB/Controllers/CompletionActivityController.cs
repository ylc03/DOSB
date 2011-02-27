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
         //   EditableRigActivityRespository.ActivitiesOnMonth(new DateTime(2010, 12, 5));
            return View(EditableCActivityRespository.All());
        }


        /// <summary>
        /// Ajax List All Torque
        /// </summary>
        /// <returns>Action Result</returns>
        [GridAction]
        public ActionResult _SelectAjax()
        {
            Telerik.Web.Mvc.GridModel grid = new GridModel(EditableCActivityRespository.All());

            return View(grid);
        }

     
        public ActionResult _EditAjax(int id)
        {
            EditableCActivity target;
            if (id == 0)
            {
                target = new EditableCActivity();
            }
            else
            {
                target = EditableCActivityRespository.One(ca => ca.ActivityId == id);
            }

           ///?????? ViewData["employees"] = GlobalConstant.GetAllEmployees();
            return View(target);
        }

        //[HttpPost]
        //public ActionResult _EditAjax(int id)
        //{
        //    EditableCActivity target = EditableCActivityRespository.One(ca => ca.ActivityId == id);

        //    if (TryUpdateModel(target))
        //    {

        //        EditableCActivityRespository.Update(target);

        //        storeDB.SaveChanges();

        //        return Content("update succeeded!");
        //    }

        //    return Content("update failed!");
        //}

        [HttpPost]
        public ActionResult _InsertAjax()
        {
            EditableCActivity target = new EditableCActivity();

            if (TryUpdateModel(target))
            {
                EditableCActivityRespository.Insert(target);



                    storeDB.SaveChanges();

                return Content("insert succeeded!");
            }

            return Content("insert failed!");
        }

        public ActionResult _DeleteAjax(int id)
        {
            EditableCActivity target = EditableCActivityRespository.One(ca => ca.ActivityId == id);
            return View(target);
        }

        [HttpPost]
        public ActionResult _ConfirmDeleteAjax(int id)
        {
            EditableCActivity target = EditableCActivityRespository.One(ca => ca.ActivityId == id);
            EditableCActivityRespository.Delete(target);
            return Content("delete succeeded!");
        }
    }
}
