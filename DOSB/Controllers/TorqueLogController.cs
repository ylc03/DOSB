using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using Telerik.Web.Mvc;


using DOSB.Models;
using DOSB.Models.EditableModels;
using DOSB.Models.EditableRespositories;

namespace DOSB.Controllers
{
    public class TorqueLogController : Controller
    {
        private DOSBEntities storeDB = new DOSBEntities();

        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// Ajax List All Torque
        /// </summary>
        /// <returns>Action Result</returns>
        [GridAction]
        public ActionResult _SelectAjax()
        {
            return View(new GridModel(EditableTorqueLogRespository.All()));
        }

        public ActionResult _ApproveAjax(int id)
        {
            EditableTorqueLog torque = EditableTorqueLogRespository.One(t => t.TorqueId == id);

            ViewData["employees"] = GlobalConstant.GetAllEmployees();
            return View(torque);
        }

        [HttpPost]
        public ActionResult _ApproveAjax(int id, int approvedBy, string password)
        {
            if (!Employee.AuthenticateID(approvedBy, password))
            {
                return Content("Password Wrong!");
            }
            EditableTorqueLog torque = EditableTorqueLogRespository.One(t => t.TorqueId == id);
            torque.ApprovedBy = approvedBy;
            EditableTorqueLogRespository.Update(torque);
            return Content("approved!");
        }

        public ActionResult _EditAjax(int id)
        {
            EditableTorqueLog torque;
            if (id == 0)
            {
                torque = new EditableTorqueLog();
            }
            else
            {
                torque = EditableTorqueLogRespository.One(t => t.TorqueId == id);
            }
           
            ViewData["employees"] = GlobalConstant.GetAllEmployees();
            return View(torque);
        }

        [HttpPost]
        public ActionResult _EditAjax(int id, string guid)
        {
            EditableTorqueLog torque = EditableTorqueLogRespository.One(t => t.TorqueId == id);

            if (TryUpdateModel(torque))
            {
                if (guid != torque.AttachmentGuid)
                {
                    if (!String.IsNullOrWhiteSpace(torque.AttachmentGuid))
                    {
                        Attachment oldatt = storeDB.Attachment.First(a => a.Guid == torque.AttachmentGuid);
                        storeDB.Attachment.DeleteObject(oldatt);
                    }

                    if (!String.IsNullOrWhiteSpace(guid))
                    {
                        Attachment newatt = storeDB.Attachment.First(a => a.Guid == guid);
                        torque.AttachmentGuid = newatt.Guid;
                        newatt.AttachTo(typeof(Torque), torque.TorqueId);
                    }

                    storeDB.SaveChanges();
                }

                EditableTorqueLogRespository.Update(torque);
                return Content("update succeeded!");
            }

            return Content("update failed!");
        }

        [HttpPost]
        public ActionResult _InsertAjax(string guid)
        {
            EditableTorqueLog torque = new EditableTorqueLog();

            if (TryUpdateModel(torque))
            {
                EditableTorqueLogRespository.Insert(torque);

                if (guid != torque.AttachmentGuid)
                {
                    if (!String.IsNullOrWhiteSpace(torque.AttachmentGuid))
                    {
                        Attachment oldatt = storeDB.Attachment.First(a => a.Guid == torque.AttachmentGuid);
                        storeDB.Attachment.DeleteObject(oldatt);
                    }

                    if (!String.IsNullOrWhiteSpace(guid))
                    {
                        Attachment newatt = storeDB.Attachment.First(a => a.Guid == guid);
                        torque.AttachmentGuid = newatt.Guid;
                        torque.Attachment = newatt.FileName;
                        newatt.AttachTo(typeof(Torque), torque.TorqueId);
                    }

                    storeDB.SaveChanges();
                }
                return Content("insert succeeded!");
            }

            return Content("insert failed!");
        }

        public ActionResult _DeleteAjax(int id)
        {
            EditableTorqueLog torque = EditableTorqueLogRespository.One(t => t.TorqueId == id);
            return View(torque);
        }

        [HttpPost]
        public ActionResult _ConfirmDeleteAjax(int id)
        {
            EditableTorqueLog torque = EditableTorqueLogRespository.One(t => t.TorqueId == id);
            EditableTorqueLogRespository.Delete(torque);
            return Content("delete succeeded!");
        }
    }
}
