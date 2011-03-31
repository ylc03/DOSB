using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

using DOSB.Models;

namespace DOSB.Controllers
{
    public class WellStatusController : Controller
    {
        CPLDataContext store = new CPLDataContext();
        //
        // GET: /Country/

        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetJson()
        {
            var data = from item in store.WellStatus
                       select new
                       {
                           WellStatusId = item.WellStatusId,
                           Name = item.Name
                       };
            return Json(new
            {
                total = data.Count(),
                success = true,
                message = "",
                data = data
            }, JsonRequestBehavior.AllowGet); 
               
        }

        public JsonResult DeleteJson(int data)
        {
            WellStatus status = store.WellStatus.First(s => s.WellStatusId == data);

            if (status != null)
            {
                status.Deleted = 1;
                store.SubmitChanges();
                return Json(new { success = true, message = "Record deleted!" });
            }
            return Json(new { success = false, message = "Record not found!" });
        }

        public JsonResult UpdateJson(string data)
        {
            var statusVal = (WellStatus)new JavaScriptSerializer().Deserialize<WellStatus>(data);
            WellStatus statusObj = store.WellStatus.FirstOrDefault(s => s.WellStatusId == statusVal.WellStatusId);

            if (statusObj != null)
            {
                var returnVal = updateStatusRecord(statusVal, statusObj);

                return Json(new { success = true, message = "Record Updated!", data = returnVal });
            }

            // error
            return Json(new { success = false, message = "Unexpected Error" });
        }

        public JsonResult CreateJson(string data)
        {
            try
            {
                var statusVal = (WellStatus)new JavaScriptSerializer().Deserialize<WellStatus>(data);
                WellStatus statusObj = store.WellStatus.FirstOrDefault(f => f.Name == statusVal.Name);

                if (statusObj != null)
                {
                    return this.Json(new { success = false, message = "Record Exists!" });
                }
                else
                {
                    statusObj = new WellStatus();
                    var returnVal = updateStatusRecord(statusVal, statusObj);

                    return this.Json(new { success = true, message = "Record Inserted", data = returnVal });
                }
            }
            catch (Exception e)
            {
                return Json(new { success = false, message = "Unexpected Error" });
            }
        }

        private Object updateStatusRecord(WellStatus statusVal, WellStatus statusObj)
        {
            //update field name
            if (statusVal.Name != null)
            {
                statusObj.Name = statusVal.Name;
            }

           
            store.SubmitChanges();

            IQueryable<Object> record = from item in store.WellStatus
                                               where item.WellStatusId == statusObj.WellStatusId
                                               select new
                                               {
                                                   WellStatusId = item.WellStatusId,
                                                   Name = item.Name
                                               };
            return record.FirstOrDefault();
        }

    }
}
