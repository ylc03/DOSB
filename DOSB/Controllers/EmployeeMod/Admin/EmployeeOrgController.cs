using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using DOSB.Models.EditableModels;
using DOSB.Models.EditableRespositories;

namespace DOSB.Controllers.EmployeeMod.Admin
{
    public class EmployeeOrgController : Controller
    {
        //
        // GET: /EmployeeOrg/

        public ActionResult Index()
        {
            return View();
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
                    FullName = seg.FullName,
                    leaf = !seg.HasChildren
                });
            }

            return nodes;
        }
    }
}
