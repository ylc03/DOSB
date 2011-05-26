using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using DOSB.Models.EditableModels;
using DOSB.Models.EditableRespositories;
using DOSB.Models;
using System.Web.Script.Serialization;

namespace DOSB.Controllers.EmployeeMod.Admin
{
    public class EmployeeOrgController : Controller
    {
        CPLDataContext store = new CPLDataContext();
        //
        // GET: /EmployeeOrg/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult GetJson()
        {
            var data = EditableSegmentRespository.All();

            return Json(new
            {
                total = data.Count(),
                success = true,
                message = "Request listed.",
                data = data
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult UpdateJson(string data)
        {
            var orgVal = (EditableSegment)new JavaScriptSerializer().Deserialize<EditableSegment>(data);
            Segment orgObj = store.Segments.FirstOrDefault(o => o.SegmentId == orgVal.SegmentId);

            if (orgObj != null)
            {
                EditableSegment returnVal = updateOrgRecord(orgVal, orgObj);

                return Json(new { success = true, message = "Record Updated!", data = returnVal });
            }

            // error
            return Json(new { success = false, message = "Unexpected Error" });
        }

        [HttpPost]
        public ActionResult CreateJson(string data)
        {
            try
            {
                var orgVal = (EditableSegment)new JavaScriptSerializer().Deserialize<EditableSegment>(data);
                Segment orgObj = store.Segments.FirstOrDefault(o => o.Name == orgVal.Name && o.ParentId == orgVal.ParentId);

                if (orgObj != null)
                {
                    return this.Json(new { success = false, message = "Record Exists!" });
                }
                else
                {
                    orgObj = new Segment();
                    EditableSegment returnVal = updateOrgRecord(orgVal, orgObj);

                    return this.Json(new { success = true, message = "Record Inserted", data = returnVal });
                }
            }
            catch (Exception e)
            {
                return Json(new { success = false, message = "Unexpected Error" });
            }
        }

        [HttpPost]
        public JsonResult DeleteJson(int data)
        {
            Segment orgObj = store.Segments.First(s => s.SegmentId == data);

            if (orgObj != null)
            {
                store.Segments.DeleteOnSubmit(orgObj);
                store.SubmitChanges();
                return Json(new { success = true, message = "Record deleted!" });
            }
            return Json(new { success = false, message = "Record not found!" });
        }

        public ActionResult GetNodes(int node)
        {
            return Json(buildTreeNodes(EditableSegmentRespository.Children(node)), JsonRequestBehavior.AllowGet);
        }

        private IList<object> buildTreeNodes(IQueryable<EditableSegment> segments)
        {
            List<object> nodes = new List<object>();
            foreach(EditableSegment seg in segments)
            {
                nodes.Add(new
                {
                    id = seg.SegmentId,
                    text = seg.Name,
                    FullName = seg.FullName
                });
            }

            return nodes;
        }

        private EditableSegment updateOrgRecord(EditableSegment val, Segment obj)
        {
            if (!string.IsNullOrWhiteSpace(val.Name))
            {
                obj.Name = val.Name;
            }

            if (!string.IsNullOrWhiteSpace(val.FullName))
            {
                obj.FullName = val.FullName;
            }

            if (val.ParentId > 0)
            {
                obj.ParentId = val.ParentId;
            }

            if (obj.SegmentId < 1)
            {
                store.Segments.InsertOnSubmit(obj);
            }

            store.SubmitChanges();
            return EditableSegmentRespository.One(obj.SegmentId);
        }
    }
}
