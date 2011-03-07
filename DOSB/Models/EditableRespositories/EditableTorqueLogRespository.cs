using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using DOSB.Models.EditableModels;
using DOSB.Models;

namespace DOSB.Models.EditableRespositories
{
    public class EditableTorqueLogRespository
    {
        /// <summary>
        /// All torques
        /// CPL LINQ to SQL model for read only, should removed later
        /// </summary>
        /// <returns>All editable torque</returns>
        public static IList<EditableTorqueLog> All()
        {
            IList<EditableTorqueLog> result =
                (IList<EditableTorqueLog>)HttpContext.Current.Session["torques"];

            if (result == null)
            {
                CPLDataContext storeDB = new CPLDataContext();
                string attachableType = typeof(Torque).ToString();
                result = new List<EditableTorqueLog>();

                foreach (var torque in storeDB.Torques.ToList())
                {
                    EditableTorqueLog editableTorque = new EditableTorqueLog();
                    editableTorque.TorqueId = torque.TorqueId;
                    editableTorque.PartNumber = torque.PartNumber;
                    editableTorque.SerialNumber = torque.SerialNumber;
                    editableTorque.StartAt = torque.StartAt.HasValue ? torque.StartAt.Value : DateTime.Now;
                    editableTorque.FinishAt = torque.FinishAt;
                    editableTorque.TorqueBy = torque.TorqueBy.HasValue ? torque.TorqueBy.Value : 0;
                    editableTorque.ApprovedBy = torque.ApprovedBy.HasValue ? torque.ApprovedBy.Value : 0;
                    editableTorque.Defect = torque.Defect > 0;
                    editableTorque.AssemblyType = torque.AssemblyType;
                    editableTorque.Comment = torque.Comment;

                    if (storeDB.Attachments.Count(a => a.AttachableType == attachableType
                                              && a.AttachableId == torque.TorqueId) > 0)
                    {
                        Attachment attachment = storeDB.Attachments.FirstOrDefault(a => a.AttachableType == attachableType
                                                                               && a.AttachableId == torque.TorqueId);
                        editableTorque.Attachment = attachment.FileName;
                        editableTorque.AttachmentGuid = attachment.Guid;
                    }

                    result.Add(editableTorque);
                }

                HttpContext.Current.Session["torques"] = result;
            }

            return result;
        }

        /// <summary>
        /// Find One Editable torque
        /// </summary>
        /// <param name="predicate">predicate</param>
        /// <returns>an editable torque</returns>
        public static EditableTorqueLog One(Func<EditableTorqueLog, bool> predicate)
        {
            return All().Where(predicate).FirstOrDefault();
        }

        /// <summary>
        /// Insert new torque
        /// </summary>
        /// <param name="torque">Editable torque</param>
        public static void Insert(EditableTorqueLog torque)
        {
            torque.TorqueId = All().OrderByDescending(t => t.TorqueId).First().TorqueId + 1;
            All().Insert(0, torque);

            CPLDataContext storeDB = new CPLDataContext();

            Torque target = new Torque();
            target.TorqueId = torque.TorqueId;
            target.PartNumber = torque.PartNumber;
            target.SerialNumber = torque.SerialNumber;
            target.StartAt = torque.StartAt;
            target.FinishAt = torque.FinishAt;
            target.TorqueBy = torque.TorqueBy;
            target.ApprovedBy = torque.ApprovedBy;
            target.Defect = torque.Defect ? 1 : 0;
            target.AssemblyType = torque.AssemblyType;
            target.Comment = torque.Comment;
            target.ApprovedBy = null;

            storeDB.Torques.InsertOnSubmit(target);
            storeDB.SubmitChanges();
        }

        /// <summary>
        /// Update torque
        /// </summary>
        /// <param name="torque">Editable torque</param>
        public static void Update(EditableTorqueLog torque)
        {
            CPLDataContext storeDB = new CPLDataContext();
            Torque target = storeDB.Torques.First(e => e.TorqueId == torque.TorqueId);
            
            if (target != null)
            {
                target.TorqueId = torque.TorqueId;
                target.PartNumber = torque.PartNumber;
                target.SerialNumber = torque.SerialNumber;
                target.StartAt = torque.StartAt;
                target.FinishAt = torque.FinishAt;
                target.TorqueBy = torque.TorqueBy;
                target.ApprovedBy = torque.ApprovedBy;
                target.Defect = torque.Defect ? 1 : 0;
                target.AssemblyType = torque.AssemblyType;
                target.Comment = torque.Comment;
            }

            storeDB.SubmitChanges();
        }

        /// <summary>
        /// Delete torque
        /// Currently not deleted from database.
        /// </summary>
        /// <param name="torque">Editable torque</param>
        public static void Delete(EditableTorqueLog torque)
        {
            EditableTorqueLog target = One(t => t.TorqueId == torque.TorqueId);
            if (target != null)
            {
                All().Remove(target);
            }
        }
    }
}