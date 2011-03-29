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
    public class AssemblyController : Controller
    {
        CPLDataContext store = new CPLDataContext();

        //
        // GET: /Country/

        public ActionResult Index()
        {
            return View();
        }

        #region Json Actions

        public JsonResult LowerAssemblyGetJson()
        {
            var data = from item in store.vwLowerCompletionAssemblies
                       select new EditableAssembly
                       {
                           AssemblyId = item.AssemblyId,
                           Name = item.Name,
                           Type = item.Type
                       };
            return Json(new {
                total = data.Count(),
                success = true,
                message = "",
                data = data   
            }, JsonRequestBehavior.AllowGet);    
        }

        public JsonResult UpperAssemblyGetJson()
        {
            var data = from item in store.vwUpperCompletionAssemblies
                       select new EditableAssembly
                       {
                           AssemblyId = item.AssemblyId,
                           Name = item.Name,
                           Type = item.Type
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
            Assembly asm = store.Assemblies.First(c => c.AssemblyId == data);

            if (asm != null)
            {
                asm.Deleted = 1;
                var res = from item in store.CompletionActivities
                          where item.AssemblyId == asm.AssemblyId
                             && item.Deleted == 0
                          select item;
                foreach (var item in res)
                {
                    item.Deleted = 1;
                }

                store.SubmitChanges();
                return Json(new { success = true, message = "Record deleted!" });
            }
            return Json(new { success = false, message = "Record not found!" });
        }

        public JsonResult UpdateJson(string data)
        {
            var assemblyVal = (EditableAssembly)new JavaScriptSerializer().Deserialize<EditableAssembly>(data);
            Assembly assemblyObj = store.Assemblies.FirstOrDefault(a => a.AssemblyId == assemblyVal.AssemblyId);
            
            if (assemblyObj != null)
            {
                EditableAssembly returnVal = updateAssemblyRecord(assemblyVal, assemblyObj);

                return Json(new { success = true, message = "Record Updated!", data = returnVal });
            }

            // error
            return Json(new { success = false, message = "Unexpected Error" });
        }

        public JsonResult CreateJson(string data)
        {
            try
            {
                var assemblyVal = (EditableAssembly)new JavaScriptSerializer().Deserialize<EditableAssembly>(data);
                Assembly assemblyObj = store.Assemblies.FirstOrDefault(a => a.Name == assemblyVal.Name
                                                                         && a.Type == assemblyVal.Type);

                if (assemblyObj != null)
                {
                    return this.Json(new { success = false, message = "Record Exists!" });
                }
                else
                {
                    assemblyObj = new DOSB.Models.Assembly();
                    EditableAssembly returnVal = updateAssemblyRecord(assemblyVal, assemblyObj);

                    return this.Json(new { success = true, message = "Record Inserted", data = returnVal });
                }
            }
            catch (Exception e)
            {
                return Json(new { success = false, message = "Unexpected Error" });
            }
        }

        private EditableAssembly updateAssemblyRecord(EditableAssembly assemblyVal, Assembly assemblyObj)
        {
            //update field name
            if (assemblyVal.Name != null)
            {
                 assemblyObj.Name = assemblyVal.Name;
            }

            // update country
            if (assemblyVal.Type != null)
            {
                assemblyObj.Type = assemblyVal.Type;
            }

            if (assemblyObj.AssemblyId <= 0)
            {
                store.Assemblies.InsertOnSubmit(assemblyObj);
            }

            store.SubmitChanges();

            IQueryable<EditableAssembly> record = from item in store.Assemblies
                                             where item.AssemblyId == assemblyObj.AssemblyId
                                             select new EditableAssembly
                                             {
                                                 AssemblyId = item.AssemblyId,
                                                 Name = item.Name,
                                                 Type = item.Type
                                             };
            return (EditableAssembly)record.FirstOrDefault();
        }
        #endregion
    }
}
