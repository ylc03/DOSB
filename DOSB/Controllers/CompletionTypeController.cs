using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

using DOSB.Models;

namespace DOSB.Controllers
{
    public class CompletionTypeController : Controller
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

            var data = from item in store.CompletionTypes
                       select new 
                       {
                           CompletionTypeId = item.CompletionTypeId,
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
            CompletionType compType = store.CompletionTypes.First(c => c.CompletionTypeId == data);

            if (compType != null)
            {
                compType.Deleted = 1;
                store.SubmitChanges();
                return Json(new { success = true, message = "Record deleted!" });
            }
            return Json(new { success = false, message = "Record not found!" });
        }

        public JsonResult UpdateJson(string data)
        {
            var compTypeVal = (CompletionType)new JavaScriptSerializer().Deserialize<CompletionType>(data);
            CompletionType compTypeObj = store.CompletionTypes.FirstOrDefault(c => c.CompletionTypeId == compTypeVal.CompletionTypeId);

            if (compTypeObj != null)
            {
                var returnVal = updateCompletionTypeRecord(compTypeVal, compTypeObj);

                return Json(new { success = true, message = "Record Updated!", data = returnVal });
            }

            // error
            return Json(new { success = false, message = "Unexpected Error" });
        }

        public JsonResult CreateJson(string data)
        {
            try
            {
                var compTypeVal = (CompletionType)new JavaScriptSerializer().Deserialize<CompletionType>(data);
                CompletionType compTypeObj = store.CompletionTypes.FirstOrDefault(w => w.Name == compTypeVal.Name);

                if (compTypeObj != null)
                {
                    return this.Json(new { success = false, message = "Record Exists!" });
                }
                else
                {
                    compTypeObj = new CompletionType();
                    var returnVal = updateCompletionTypeRecord(compTypeVal, compTypeObj);

                    return this.Json(new { success = true, message = "Record Inserted", data = returnVal });
                }
            }
            catch (Exception e)
            {
                return Json(new { success = false, message = "Unexpected Error" });
            }
        }

        private Object updateCompletionTypeRecord(CompletionType compTypeVal, CompletionType compTypeObj)
        {
            //update field name
            if (compTypeVal.Name != null)
            {
                compTypeObj.Name = compTypeVal.Name;
            }


            store.SubmitChanges();

            IQueryable<Object> record = from item in store.CompletionTypes
                                        where item.CompletionTypeId == compTypeObj.CompletionTypeId
                                        select new
                                        {
                                            CompletionTypeId = item.CompletionTypeId,
                                            Name = item.Name
                                        };
            return record.FirstOrDefault();
        }
    }
}
