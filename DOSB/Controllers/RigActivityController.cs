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

        public JsonResult DeleteJson(int data)
        {
            RigActivity rigActivity = store.RigActivities.First(a => a.RigActivityId == data);

            if (rigActivity != null)
            {
                rigActivity.Deleted = 1;
                store.SubmitChanges();
                return Json(new { success = true, message = "Record deleted!" });
            }
            return Json(new { success = false, message = "Record not found!" });
        }

        public JsonResult UpdateJson(string data)
        {
            var rigActivityVal = (EditableRigActivity)new JavaScriptSerializer().Deserialize<EditableRigActivity>(data);
            RigActivity rigActivityObj = store.RigActivities.FirstOrDefault(ra => ra.RigActivityId == rigActivityVal.RigActivityId);

            if (rigActivityObj != null)
            {
                EditableRigActivity returnVal = updateRigActivityRecord(rigActivityVal, rigActivityObj);

                return Json(new { success = true, message = "Record Updated!", data = returnVal });
            }

            // error
            return Json(new { success = false, message = "Unexpected Error" });
        }

        public JsonResult CreateJson(string data)
        {
            var rigActivityVal = (EditableRigActivity)new JavaScriptSerializer().Deserialize<EditableRigActivity>(data);
            RigActivity rigActivityObj = new RigActivity();
           
            if (rigActivityVal.RigId <= 0 && rigActivityVal.RigName == null) {
                return this.Json(new { success = false, message = "Rig must be specified." });
            }

            //update client
            if (rigActivityVal.FieldName == null)
            {
                return Json(new { success = false, message = "Field must be specified." });
            }

            if (rigActivityObj != null)
            {   
                EditableRigActivity returnVal = updateRigActivityRecord(rigActivityVal, rigActivityObj);

                return this.Json(new { success = true, message = "Record Inserted", data = returnVal });
            }

            return Json(new { success = false, message = "Unexpected Error" });
        }

        private EditableRigActivity updateRigActivityRecord(EditableRigActivity rigActivityVal, RigActivity rigActivityObj)
        {
            //update rigActivity name
            if (rigActivityVal.RigId > 0)
            {
                rigActivityObj.RigId = rigActivityVal.RigId;
            }
            else
            {
                Rig rig = store.Rigs.FirstOrDefault(r => r.Name == rigActivityVal.RigName);
                if (rig == null)
                {
                    rig = new Rig();
                    rig.Name = rigActivityVal.RigName;
                }
                rigActivityObj.Rig = rig;
            }
            
            Field field = store.Fields.FirstOrDefault(f => f.Name == rigActivityVal.FieldName);
            // update well
            if (rigActivityVal.WellName != null)
            {
                Well well = store.Wells.FirstOrDefault(w => w.Name == rigActivityVal.WellName);
                if (well == null)
                {
                    well = new Well()
                    {
                        Name = rigActivityVal.WellName
                    };
                }
                
                rigActivityObj.Well = well;
                rigActivityObj.Well.Field = field;
            }

            // update time
            DateTime result;
            if (rigActivityVal.StartDate != null && DateTime.TryParse(rigActivityVal.StartDate, out result))
            {
                rigActivityObj.StartAt = result;
            }
            if (rigActivityVal.EndDate != null && DateTime.TryParse(rigActivityVal.EndDate, out result))
            {
                rigActivityObj.FinishAt = result;
            }

            store.SubmitChanges();

            IQueryable<EditableRigActivity> record = from tbl in store.vwRigActivities
                                               where tbl.RigActivityId == rigActivityObj.RigActivityId
                                               select new EditableRigActivity
                                               {
                                                   RigActivityId = tbl.RigActivityId,
                                                   RigId = tbl.RigId,
                                                   RigName = tbl.RigName,
                                                   WellName = tbl.WellName,
                                                   FieldName = tbl.FieldName,
                                                   ClientName = tbl.ClientName,
                                                   CountryName = tbl.CountryName,
                                                   CompletionTypeName = tbl.CompletionTypeName,
                                                   WellStatus = tbl.WellStatus,
                                                   WellTypeName = tbl.WellTypeName,
                                                   Comment = tbl.Comment,
                                                   StartAt = tbl.StartAt.HasValue ? tbl.StartAt.Value : DateTime.Today,
                                                   FinishAt = tbl.FinishAt.HasValue ? tbl.FinishAt.Value : DateTime.Today.AddMonths(1)
                                               };
            return (EditableRigActivity)record.FirstOrDefault();
        }

    }
}
