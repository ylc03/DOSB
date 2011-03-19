using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

using DOSB.Models;

namespace DOSB.Controllers
{
    public class FieldController : Controller
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
            var data = from item in store.vwFields
                       select new
                       {
                           FieldId = item.FieldId,
                           Name = item.Name,
                           Client = item.Client,
                           Country = item.Country
                       };
            return Json(new {
                total = data.Count(),
                success = true,
                message = "",
                data = data   
            }, JsonRequestBehavior.AllowGet);    
        }

        public JsonResult DeleteJson(int data)
        {
            Field field = store.Fields.First(c => c.FieldId == data);

            if (field != null)
            {
                field.Deleted = 1;
                store.SubmitChanges();
                return Json(new { success = true, message = "Record deleted!" });
            }
            return Json(new { success = false, message = "Record not found!" });
        }

        public JsonResult UpdateJson(string data)
        {
            var fieldVal = (Field)new JavaScriptSerializer().Deserialize<Field>(data);
            Field fieldObj = store.Fields.Single(f => f.FieldId == fieldVal.FieldId);

            if (fieldObj != null)
            {
                //Country country = (Country)store.Countries.Single(c => c.Name == fieldVal.Country);
                fieldObj.Country = fieldVal.Country;
                fieldObj.Client = fieldVal.Client;
                fieldObj.Name = fieldVal.Name;
                store.SubmitChanges();

                return this.Json(new { success = true, message = "", data = fieldObj });
            }

            return Json(new { success = false, message = "Unexpected Error" });
        }


    }
}
