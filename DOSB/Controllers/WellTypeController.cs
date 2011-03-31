﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

using DOSB.Models;

namespace DOSB.Controllers
{
    public class WellTypeController : Controller
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
            var data = from item in store.WellTypes
                       select new
                       {
                           WellTypeId = item.WellTypeId,
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
            WellType wellType = store.WellTypes.First(w => w.WellTypeId == data);

            if (wellType != null)
            {
                wellType.Deleted = 1;
                store.SubmitChanges();
                return Json(new { success = true, message = "Record deleted!" });
            }
            return Json(new { success = false, message = "Record not found!" });
        }

        public JsonResult UpdateJson(string data)
        {
            var wellTypeVal = (WellType)new JavaScriptSerializer().Deserialize<WellType>(data);
            WellType wellTypeObj = store.WellTypes.FirstOrDefault(w => w.WellTypeId == wellTypeVal.WellTypeId);

            if (wellTypeObj != null)
            {
                var returnVal = updateWellTypeRecord(wellTypeVal, wellTypeObj);

                return Json(new { success = true, message = "Record Updated!", data = returnVal });
            }

            // error
            return Json(new { success = false, message = "Unexpected Error" });
        }

        public JsonResult CreateJson(string data)
        {
            try
            {
                var wellTypeVal = (WellType)new JavaScriptSerializer().Deserialize<WellType>(data);
                WellType wellTypeObj = store.WellTypes.FirstOrDefault(w => w.Name == wellTypeVal.Name);

                if (wellTypeObj != null)
                {
                    return this.Json(new { success = false, message = "Record Exists!" });
                }
                else
                {
                    wellTypeObj = new WellType();
                    var returnVal = updateWellTypeRecord(wellTypeVal, wellTypeObj);

                    return this.Json(new { success = true, message = "Record Inserted", data = returnVal });
                }
            }
            catch (Exception e)
            {
                return Json(new { success = false, message = "Unexpected Error" });
            }
        }

        private Object updateWellTypeRecord(WellType wellTypeVal, WellType wellTypeObj)
        {
            //update field name
            if (wellTypeVal.Name != null)
            {
                wellTypeObj.Name = wellTypeVal.Name;
            }


            store.SubmitChanges();

            IQueryable<Object> record = from item in store.WellTypes
                                        where item.WellTypeId == wellTypeObj.WellTypeId
                                        select new
                                        {
                                            WellTypeId = item.WellTypeId,
                                            Name = item.Name
                                        };
            return record.FirstOrDefault();
        }
    }
}
