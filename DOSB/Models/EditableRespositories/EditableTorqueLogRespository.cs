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
                HttpContext.Current.Session["torques"] = result =
                    (from torque in new CPLDataContext().TorqueLogs
                     select new EditableTorqueLog
                     {
                         TorqueId = torque.TorqueId,
                         PartNumber = torque.PartNumber,
                         SerialNumber = torque.SerialNumber,
                         StartAt = torque.StartAt.HasValue ? torque.StartAt.Value : DateTime.Now,
                         FinishAt = torque.FinishAt,
                         TorqueBy = torque.TorqueBy.HasValue ? torque.TorqueBy.Value : 0,
                         ApprovedBy = torque.ApprovedBy.HasValue ? torque.ApprovedBy.Value : 0,
                     }).ToList();
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
        }

        /// <summary>
        /// Update torque
        /// </summary>
        /// <param name="torque">Editable torque</param>
        public static void Update(EditableTorqueLog torque)
        {
            DOSBEntities storeDB = new DOSBEntities();
            Torque target = storeDB.Torque.First(e => e.TorqueId == torque.TorqueId);

            if (target != null)
            {
                target.TorqueId = torque.TorqueId;
                target.PartNumber = torque.PartNumber;
                target.SerialNumber = torque.SerialNumber;
                target.StartAt = torque.StartAt;
                target.FinishAt = torque.FinishAt;
                target.TorqueBy = torque.TorqueBy;
                target.ApprovedBy = torque.ApprovedBy;
            }

            storeDB.SaveChanges();
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