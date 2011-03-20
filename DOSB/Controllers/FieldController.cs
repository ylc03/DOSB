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
                       select new EditableField
                       {
                           FieldId = item.FieldId,
                           Name = item.Name,
                           ClientName = item.ClientName,
                           ClientId = item.ClientId,
                           CountryName = item.CountryName,
                           CountryId = item.CountryId
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
            var fieldVal = (EditableField)new JavaScriptSerializer().Deserialize<EditableField>(data);
            Field fieldObj = store.Fields.FirstOrDefault(f => f.FieldId == fieldVal.FieldId);
            
            if (fieldObj != null)
            {
                EditableField returnVal = updateFieldRecord(fieldVal, fieldObj);

                return Json(new { success = true, message = "Record Updated!", data = returnVal });
            }

            // error
            return Json(new { success = false, message = "Unexpected Error" });
        }

        public JsonResult CreateJson(string data)
        {
            var fieldVal = (EditableField)new JavaScriptSerializer().Deserialize<EditableField>(data);
            Field fieldObj = store.Fields.FirstOrDefault(f => f.Name == fieldVal.Name);

            if (fieldObj != null)
            {
                return this.Json(new { success = false, message = "Record Exists!"});
            }
            else
            {
                fieldObj = new Field();
                EditableField returnVal = updateFieldRecord(fieldVal, fieldObj);

                return this.Json(new { success = true, message = "Record Inserted", data = returnVal });
            }

            return Json(new { success = false, message = "Unexpected Error" });
        }

        private EditableField updateFieldRecord(EditableField fieldVal, Field fieldObj)
        {
            //update field name
            if (fieldVal.Name != null)
            {
                fieldObj.Name = fieldVal.Name;
            }

            // update country
            if (fieldVal.CountryName != null)
            {
                Country country = store.Countries.FirstOrDefault(c => c.Name == fieldVal.CountryName);
                if (country == null)
                {
                    country = new Country()
                    {
                        Name = fieldVal.CountryName
                    };
                }
                fieldObj.Country = country;
            }

            //update client
            if (fieldVal.ClientName != null)
            {
                Client client = store.Clients.FirstOrDefault(c => c.Name == fieldVal.ClientName);
                if (client == null)
                {
                    client = new Client()
                    {
                        Name = fieldVal.ClientName
                    };
                }
                fieldObj.Client = client;
            }

            store.SubmitChanges();

            IQueryable<EditableField> record = from item in store.vwFields
                                             where item.FieldId == fieldObj.FieldId
                                             select new EditableField
                                             {
                                                 FieldId = item.FieldId,
                                                 Name = item.Name,
                                                 ClientName = item.ClientName,
                                                 ClientId = item.ClientId,
                                                 CountryName = item.CountryName,
                                                 CountryId = item.CountryId
                                             };
            return (EditableField)record.FirstOrDefault();
        }
    }
}
