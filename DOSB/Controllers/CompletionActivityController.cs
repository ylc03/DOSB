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

        public JavaScriptResult CustomHeaderJS()
        {
            var upper = store.vwUpperCompletionAssemblies;
            var lower = store.vwLowerCompletionAssemblies.ToList();
            var company = EditableCompanyRespository.All().ToList();

            string js = "Ext.ns(\'Dosb\', \'Dosb.CActivity\');\n"
                      + "Dosb.CActivity.MonthViewHeaderData = {\n"
                      + "upperCount: " + upper.Count().ToString() + ",\n"
                      + "lowerCount: " + lower.Count().ToString() + ",\n"
                      + "start: new Date(" + DateTime.Today.Year.ToString() + "," + (DateTime.Today.Month - 1).ToString() + "," + DateTime.Today.Day.ToString() + "),\n"
                      + "headers : [\n";
            foreach (var item in upper)
            {
                js += "'" + item.Name + "',\n";
            }
            foreach (var item in lower)
            {
                js += "'" + item.Name + "'";
                if (lower.Last() != item)
                {
                    js += ",\n";
                }
            }
            js += "]};\n";

            js += "Dosb.CActivity.CompanyColor = {\n";
            foreach (var item in company)
            {
                js += "'" + item.ShortName + "':{'BackgroundColor': '" + item.BackgroundColor + "', 'TextColor': '" + item.TextColor + "'}";
                if (company.Last() != item)
                {
                    js += ",\n";
                }
            }
            js += "};\n";
            js += "Dosb.CActivity.WellStatus = ['Developement', 'W/O', 'Exp.', 'M W/O'];";
            return JavaScript(js);
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

        public JsonResult CreateJson(string data)
        {
            var caVal = (EditableCompletionActivity)new JavaScriptSerializer().Deserialize<EditableCompletionActivity>(data);
            CompletionActivity caObj = new CompletionActivity();

            if (caVal.RigActivityId <= 0)
            {
                return this.Json(new { success = false, message = "Rig activity must be specified." });
            }

            //update client
            if (caVal.AssemblyType == null)
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

            // update assembly type
            if (caVal.AssemblyType != null)
            {
                Assembly asm = store.Assemblies.FirstOrDefault(a => a.Name == caVal.AssemblyType);
                caObj.Assembly = asm;
            }

            // update company
            if (caVal.CompanyName != null)
            {
                Company company = store.Companies.FirstOrDefault(c => c.ShortName == caVal.CompanyName);
                caObj.Company = company;
            }

            if (caVal.Comment != null)
            {
                caObj.Comment = caVal.Comment;
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
                                                                StartDate = EditableAssemblyRespository.AssemblyToJSStartTime(tbl.AssemblyId),
                                                                EndDate = EditableAssemblyRespository.AssemblyToJSEndTime(tbl.AssemblyId),
                                                            };

            return (EditableCompletionActivity)record.FirstOrDefault();
        }

    }
}
