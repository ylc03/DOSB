using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

using Telerik.Web.Mvc.UI;
using Telerik.Web.Mvc;

using DOSB.Models;
using DOSB.Models.EditableModels;
using DOSB.Models.EditableRespositories;

namespace DOSB.Controllers
{
    public class CompletionActivityController : Controller
    {
        private CPLDataContext store = new CPLDataContext();

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

        public JsonResult GetByTimeSpan(DateTime startDate, DateTime endDate)
        {
            var data = EditableCompletionActivityRespository.AllByTimeSpan(startDate, endDate);

            return Json(new
            {
                total = data.Count(),
                success = true,
                message = "Job list returned.",
                data = data,
            }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult CreateJson(string data)
        {
            var caVal = (EditableCompletionActivity)new JavaScriptSerializer().Deserialize<EditableCompletionActivity>(data);
            CompletionActivity caObj = new CompletionActivity();

            if (caVal.RigActivityId <= 0)
            {
                return this.Json(new { success = false, message = "Rig activity must be specified." });
            }

            //update client
            if (caVal.AssemblyName == null)
            {
                return Json(new { success = false, message = "Assembly must be specified." });
            }

            if (caVal.CompanyName == null)
            {
                return Json(new { success = false, message = "Company must be specified." });
            }

            if (caObj != null)
            {
                EditableCompletionActivity returnVal = updateCARecord(caVal, caObj);

                return this.Json(new { success = true, message = "Record Inserted", data = returnVal });
            }

            return Json(new { success = false, message = "Unexpected Error" });
        }

        public JsonResult DeleteJson(int data)
        {
            CompletionActivity CA = store.CompletionActivities.First(c => c.CompletionActivityId == data);

            if (CA != null)
            {
                
                CA.Deleted = 1;
                store.SubmitChanges();
                return Json(new { success = true, message = "Record deleted!" });
            }
            return Json(new { success = false, message = "Record not found!" });
        }

        public JsonResult UpdateJson(string data)
        {
            var caVal = (EditableCompletionActivity)new JavaScriptSerializer().Deserialize<EditableCompletionActivity>(data);
            CompletionActivity caObj = store.CompletionActivities.FirstOrDefault(c => c.CompletionActivityId == caVal.CompletionActivityId);

            if (caObj != null)
            {
                EditableCompletionActivity returnVal = updateCARecord(caVal, caObj);

                return this.Json(new { success = true, message = "Record Inserted", data = returnVal });
            }

            return Json(new { success = false, message = "Unexpected Error" });
        }

        private EditableCompletionActivity updateCARecord(EditableCompletionActivity caVal, CompletionActivity caObj)
        {
            //update rig activity
            if (caVal.RigActivityId > 0)
            {
                caObj.RigActivityId = caVal.RigActivityId;
            }

            // update assembly
            // Map time back to Assembly Name
            if (!String.IsNullOrWhiteSpace(caVal.StartDate) && !String.IsNullOrWhiteSpace(caVal.EndDate))
            {
                int asmId = EditableAssemblyRespository.StartTimeToAssemblyId(caVal.StartDate);
                caObj.AssemblyId = asmId;
                // should not reach here
                if (asmId == -1)
                {
                    Assembly asm = store.Assemblies.FirstOrDefault(a => a.Name == caVal.AssemblyName);
                    caObj.Assembly = asm;
                }
            }

            // update company
            if (!String.IsNullOrWhiteSpace(caVal.CompanyName))
            {
                Company company = store.Companies.FirstOrDefault(c => c.ShortName == caVal.CompanyName);
                caObj.Company = company;
            }

            // update comment
            if (!String.IsNullOrWhiteSpace(caVal.Comment))
            {
                caObj.Comment = caVal.Comment;
            }

            // update time
            DateTime result;
            if (!String.IsNullOrWhiteSpace(caVal.JobStartDate) && DateTime.TryParse(caVal.JobStartDate, out result))
            {
                caObj.StartAt = result;
            }
            if (!String.IsNullOrWhiteSpace(caVal.JobEndDate) && DateTime.TryParse(caVal.JobEndDate, out result))
            {
                caObj.FinishAt = result;
            }

            store.SubmitChanges();

            IQueryable<EditableCompletionActivity> record = from tbl in store.vwCompletionActivities
                                                            where tbl.CompletionActivityId == caObj.CompletionActivityId
                                                            select new EditableCompletionActivity
                                                            {
                                                                CompletionActivityId = tbl.CompletionActivityId,
                                                                RigActivityId = tbl.RigActivityId,
                                                                CompanyName = tbl.CompanyName,
                                                                AssemblyId = tbl.AssemblyId,
                                                                AssemblyType = tbl.AssemblyType,
                                                                AssemblyName = tbl.AssemblyName,
                                                                WellName = tbl.WellName,
                                                                RigName = tbl.RigName,
                                                                Comment = tbl.Comment == null ? "" : tbl.Comment,
                                                                BackgroundColor = tbl.BackgroundColor,
                                                                TextColor = tbl.TextColor,
                                                                StartAt = tbl.StartAt.HasValue ? tbl.StartAt.Value : DateTime.Today,
                                                                FinishAt = tbl.FinishAt.HasValue ? tbl.FinishAt.Value : DateTime.Today.AddDays(5),
                                                                StartDate = EditableAssemblyRespository.AssemblyToJSStartTime(tbl.AssemblyId),
                                                                EndDate = EditableAssemblyRespository.AssemblyToJSEndTime(tbl.AssemblyId),
                                                            };

            return (EditableCompletionActivity)record.FirstOrDefault();
        }

    }
}
