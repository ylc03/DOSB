using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

using DOSB.Models;
using DOSB.Models.EditableModels;

namespace DOSB.Controllers
{
    public class RigController : Controller
    {
        private CPLDataContext store = new CPLDataContext();

        //
        // GET: /Rig/

        public ActionResult Index()
        {
            return View();
        }

        #region Json Actions

        public JsonResult GetJson()
        {
            var data = from item in store.Rigs
                       select new
                       {
                           RigId = item.RigId,
                           Name = item.Name,
                           Type = item.Type,
                       };

            return Json(new {
                total = data.Count(),
                success = true,
                message = "Return new all rigs",
                data = data,
            }, JsonRequestBehavior.AllowGet);
        }


        public JsonResult GetByTimeSpan(DateTime? startDate, DateTime? endDate)
        {
            var data = from item in store.fnFilterRigs(startDate, endDate)
                       select new
                       {
                           RigId = item.RigId,
                           Name = item.Name,
                           EngId = item.DeskEngId
                       };

            return Json(new
            {
                total = data.Count(),
                success = true,
                message = "Return new all rigs",
                data = data,
            }, JsonRequestBehavior.AllowGet);
        }
        
        
        public JsonResult UpdateJson(string data)
        {
            try
            {
                var rigVal = (EditableRig)new JavaScriptSerializer().Deserialize<EditableRig>(data);
                Rig rigObj = store.Rigs.FirstOrDefault(f => f.RigId == rigVal.RigId);

                if (rigObj != null)
                {
                    EditableRig returnVal = updateRigRecord(rigVal, rigObj);

                    return Json(new { success = true, message = "Record Updated!", data = returnVal });
                }

                return Json(new { success = false, message = "Record Not Found!" });
            }
            catch (Exception e)
            {
                // error
                return Json(new { success = false, message = "Unexpected Error!" });
            }
        }

        public JsonResult CreateJson(string data)
        {
            try
            {
                var rigVal = (EditableRig)new JavaScriptSerializer().Deserialize<EditableRig>(data);
                Rig rigObj = store.Rigs.FirstOrDefault(f => f.Name == rigVal.Name);

                if (rigObj == null)
                {
                    rigObj = new Rig();
                    store.Rigs.InsertOnSubmit(rigObj);
                }
                   
                EditableRig returnVal = updateRigRecord(rigVal, rigObj);
                return this.Json(new { success = true, message = "Record Inserted", data = returnVal });
                
            }
            catch (Exception e)
            {
                return Json(new { success = false, message = "Unexpected Error" });
            }
        }

        private EditableRig updateRigRecord(EditableRig rigVal, Rig rigObj)
        {
            //update rig name
            if (rigVal.Name != null)
            {
                rigObj.Name = rigVal.Name;
            }

            // update Engineer
            if (rigVal.EngId != null)
            {
                rigObj.DeskEngId = rigVal.EngId;
            }

            store.SubmitChanges();

            IQueryable<EditableRig> record = from item in store.Rigs
                                               where item.RigId == rigObj.RigId
                                               select new EditableRig
                                               {
                                                   RigId = item.RigId,
                                                   Name = item.Name,
                                                   EngId = item.DeskEngId.HasValue ? item.DeskEngId.Value : 0
                                               };
            return (EditableRig)record.FirstOrDefault();
        }

        #endregion Json Actions
    }
}
